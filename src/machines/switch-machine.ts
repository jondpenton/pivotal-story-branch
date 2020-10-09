import { exec } from 'child_process'
import { Ora } from 'ora'
import {
  assign,
  createMachine,
  DoneInvokeEvent,
  TransitionConfig,
} from 'xstate'
import { runGenerate } from '../commands/generate'

enum SwitchState {
  Initial = 'INITIAL',
  GenerateBranch = 'GENERATE_BRANCH',
  VerifyBranch = 'VERIFY_BRANCH',
  CheckoutBranch = 'CHECKOUT_BRANCH',
  CreateBranch = 'CREATE_BRANCH',
  Final = 'FINAL',
}

interface SwitchContext {
  branch?: string
  spinner: Ora
  storyId?: string
  token: string
}

async function branchExists(ctx: SwitchContext): Promise<boolean> {
  ctx.spinner.start(`Checking if branch ${ctx.branch} exists...`)

  const output = await new Promise<string>((resolve, reject) => {
    exec(`git fetch && git branch --list ${ctx.branch}`, (err, stdout) => {
      if (err) {
        ctx.spinner.fail(`Failed to check branch ${ctx.branch}`)
        reject(err)
        return
      }

      resolve(stdout)
    })
  })

  return !!output
}

async function checkoutBranch(ctx: SwitchContext): Promise<void> {
  ctx.spinner.succeed(`Found branch ${ctx.branch}`)
  ctx.spinner.start(`Switching to branch ${ctx.branch}...`)

  await new Promise<void>((resolve, reject) => {
    exec(`git checkout ${ctx.branch} && git pull`, (err) => {
      if (err) {
        ctx.spinner.fail(`Failed to switch to branch ${ctx.branch}`)
        reject(err)
        return
      }

      ctx.spinner.succeed(`Switched to branch ${ctx.branch}`)
      resolve()
    })
  })
}

async function createBranch(ctx: SwitchContext): Promise<void> {
  ctx.spinner.info(`Branch ${ctx.branch} doesn't exist`)
  ctx.spinner.start(`Creating branch ${ctx.branch}...`)

  await new Promise<void>((resolve, reject) => {
    exec(`git pull && git checkout -b ${ctx.branch}`, (err) => {
      if (err) {
        ctx.spinner.fail(`Failed to create branch ${ctx.branch}`)
        reject(err)
        return
      }

      ctx.spinner.succeed(`Created branch ${ctx.branch}`)
      resolve()
    })
  })
}

const isTruthy = (_ctx: SwitchContext, event: DoneInvokeEvent<unknown>) =>
  !!event.data
const branchInContext = (ctx: SwitchContext) => !!ctx.branch
const storyIdInContext = (ctx: SwitchContext) => !!ctx.storyId

const switchMachine = createMachine<SwitchContext>({
  id: 'switch',
  initial: SwitchState.Initial,
  states: {
    [SwitchState.Initial]: {
      on: {
        '': [
          {
            cond: branchInContext,
            target: SwitchState.VerifyBranch,
          },
          {
            cond: storyIdInContext,
            target: SwitchState.GenerateBranch,
          },
          {
            target: SwitchState.Final,
            actions: [
              (ctx) => ctx.spinner.fail('Failed to find branch or story id'),
            ],
          },
        ],
      },
    },
    [SwitchState.GenerateBranch]: {
      invoke: {
        id: 'getBranch',
        src: (ctx) =>
          runGenerate({
            spinner: ctx.spinner,
            token: ctx.token,
            storyId: ctx.storyId!,
          }),
        onDone: {
          actions: [assign({ branch: (_ctx, event) => event.data })],
          target: SwitchState.VerifyBranch,
        } as TransitionConfig<SwitchContext, DoneInvokeEvent<string>>,
        onError: {
          target: SwitchState.Final,
        },
      },
    },
    [SwitchState.VerifyBranch]: {
      invoke: {
        id: 'verifyBranch',
        src: branchExists,
        onDone: [
          {
            cond: isTruthy,
            target: SwitchState.CheckoutBranch,
          },
          {
            target: SwitchState.CreateBranch,
          },
        ] as TransitionConfig<SwitchContext, DoneInvokeEvent<boolean>>[],
        onError: {
          target: SwitchState.Final,
        },
      },
    },
    [SwitchState.CheckoutBranch]: {
      invoke: {
        id: 'checkoutBranch',
        src: checkoutBranch,
        onDone: {
          target: SwitchState.Final,
        },
        onError: {
          target: SwitchState.Final,
        },
      },
    },
    [SwitchState.CreateBranch]: {
      invoke: {
        id: 'createBranch',
        src: createBranch,
        onDone: {
          target: SwitchState.Final,
        },
        onError: {
          target: SwitchState.Final,
        },
      },
    },
    [SwitchState.Final]: {
      type: 'final',
    },
  },
})

export { switchMachine }
