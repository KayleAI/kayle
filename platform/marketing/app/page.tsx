"use client";

import { Link } from "@repo/ui/link";
import { useState } from "react";

const terminal = `// this is the message you want to moderate
const message = "Hello, world!";

// now create the request
const res = await fetch('https://api.kayle.ai/v1/moderate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_API_KEY>'
  },
  body: JSON.stringify({
    type: 'text',
    data: {message},
    parties: ['<YOUR_USER_ID(s)>']
  })
});

// now continue with the response!`;

export default function KayleLandingPage() {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('Awaiting message\n\n\n');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const handleSubmit = async () => {
    if (terminalInput.trim() === '') {
      return;
    }

    setIsInputDisabled(true);

    setTerminalOutput(`Running test on “${terminalInput}”...\n\n\n`);

    // Make POST request to your server endpoint
    const response = await fetch('/api/hunt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: terminalInput }),
    });

    const data = await response.json();

    let output = `Text moderation output for “${terminalInput}”:\nSeverity: ${data.severity || 0}\nViolations: ${data.violations.length > 0 ? data.violations.join(', ') : 'None'}\n`;
    setTerminalOutput(output);

    setTerminalInput('');

    setIsInputDisabled(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-green-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <Link href="/blog/launching-text-moderation-v1" className="inline-flex space-x-6">
                    <span className="rounded-full bg-green-600/10 px-3 py-1 text-sm font-semibold leading-6 text-green-600 ring-1 ring-inset ring-green-600/10">
                      What’s new
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-neutral-600">
                      <span>Just shipped Text Moderation</span>
                      <span className="" aria-hidden="true">&rarr;</span>
                    </span>
                  </Link>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-neutral-950 sm:text-6xl">
                  Content moderation made easy
                </h1>
                <p className="mt-6 text-lg leading-8 text-neutral-600">
                  Moderate content in real-time with Kayle’s open-source API. Keep your platform safe and your users happy in minutes.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href={"https://console.kayle.ai"}
                    className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    Get started
                  </Link>
                  <Link href="https://docs.kayle.ai" className="text-sm font-semibold leading-6 text-neutral-950">
                    Documentation <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-green-600/10 ring-1 ring-green-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-green-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-green-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36"
                  aria-hidden="true"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-neutral-900">
                      <div className="flex bg-neutral-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            moderate.js
                          </div>
                          <div className="border-r border-neutral-600/10 px-4 py-2">app.js</div>
                        </div>
                      </div>
                      <div className="px-6 pb-14 pt-6 text-white">
                        <pre>{terminal}</pre>
                      </div>
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
      <div className="mx-auto py-24 px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-green-600">
            Happy Hunting!
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Hunt for words or phrases that violate Kayle’s policy.
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            By using Kayle’s Hunting Terminal, you provide us with valuable data that helps us improve our
            filters.
          </p>
        </div>
        <div
          className="relative isolate overflow-hidden bg-neutral-900 shadow-2xl rounded-3xl lg:flex lg:gap-x-20 lg:pt-0 mt-8 mx-auto max-w-4xl"
        >
          <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
            <div className="w-screen overflow-visible rounded-tl-xl bg-neutral-900">
              <div className="flex bg-neutral-800/40 ring-1 ring-white/5">
                <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400">
                  <div
                    className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 py-2 px-4 text-white">
                    &nbsp;&nbsp;&nbsp;terminal
                  </div>
                  <div className="border-r border-neutral-600/10 py-2 px-4">api.kayle.ai</div>
                </div>
              </div>
              {/*<span className="text-amber-300">Current Score: <span id="total_score">0</span></span>*/}
              <div className="pt-6 px-6">
                <pre className="text-white">
                  Kayle’s Hunting Terminal
                  <br />
                  Here you can see whether a message will be flagged by Kayle’s filters!
                  <br />
                  <span className="text-green-400">kayle@ai~$:</span> run hunter
                  <br />
                  {terminalOutput}
                  <br />
                  <br />
                </pre>
              </div>

              <div className="hidden lg:flex bg-neutral-800/40 ring-1 ring-white/5 max-w-4xl">
                <span>
                  <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400">
                    <div
                      className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 py-2 px-4 text-white"
                    >
                      &nbsp;&nbsp;&nbsp;Enter your message:
                    </div>
                  </div>
                </span>

                <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400 grow">
                  <input
                    type="text"
                    name="terminal_input"
                    id="terminal_input"
                    maxLength={70}
                    required
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="kayle@ai~$:"
                    className="border-none bg-transparent grow text-zinc-50 px-4"
                    onKeyDown={handleKeyPress}
                    disabled={isInputDisabled}
                  />
                </div>

                <button id="terminal_button" onClick={handleSubmit}>
                  <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400">
                    <div
                      className="border-b border-l border-b-white/20 border-l-white/10 bg-white/5 py-2 px-4 text-white"
                    >
                      Submit&nbsp;&nbsp;&nbsp;
                    </div>
                  </div>
                </button>
              </div>
              <div className="flex lg:hidden bg-neutral-800/40 ring-1 ring-white/5 max-w-4xl">
                <div className="-mb-px flex text-sm font-medium leading-6 text-neutral-400">
                  <div
                    className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 py-2 px-4 text-white">
                    &nbsp;&nbsp;&nbsp;This hunt is only available on desktop, sorry!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
