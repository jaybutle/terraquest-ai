# TerraQuest AI — Less scrolling. More exploring.

`#devchallenge` `#hf26challenge`

## What it does

TerraQuest AI turns a few minutes of planning into a practical outdoor quest. People can prepare digitally, save a quest locally, put their phone away, then return to record an observation in a private Nature Journal.

Demo: `[add verified demo link]`  
Repository: `[add verified GitHub repository link]`

## How it was built

The app uses React and Vite with a warm, accessible interface, localStorage persistence, Pocket Quest Mode, a Nature Passport, and a service-worker shell cache. A small Express endpoint connects optional Gemma inference through Ollama. When the local service is unavailable, a clearly labeled curated guide keeps the core experience useful.

Quest Council is designed as a generation and validation boundary: model output must have the required structure before it is rendered. The current UI reports the available check without claiming a scientific safety guarantee.

## Why open innovation matters

Local inference gives people model choice and more control over what leaves their device. Journal entries and images remain local by default. Gemma is meaningful for personalized quest generation when the user has Ollama installed, but the saved outdoor experience does not depend on a hosted API or an always-on connection.

## Evidence and limitations

Add real screenshots and links before submission. Do not claim model benchmarks, deployment, user counts, or offline AI generation without evidence. Local inference requires compatible hardware and consumes local resources.

## Agent-session link

`[optional verified agent-session link]`

## Eligible categories

`[confirm only categories supported by the final challenge rules and verified implementation]`

The goal is simple: prepare digitally, explore physically, and make the screen the shortest part of the journey.
