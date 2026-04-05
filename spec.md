# Ritik's Apology for Muskan

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Multi-step interactive apology website with 5 steps/pages
- Step 1 (Gatekeeper): Question "Who is visiting right now?" with two buttons: [I am Ritik's Girlfriend] and [I am her Sister]. If Sister is clicked, show funny denial message. If Girlfriend, proceed to Step 2.
- Step 2 (Reveal): Congratulations header, romantic description of Muskan, "Is this you?" with [YES] button to proceed.
- Step 3 (Apology): Heartfelt apology message, two verdict buttons: [KYA AAPNE USE MAAF KIYA??] and [MAINE USE MAAF KRDIYA].
- Step 4 (Logic): If first button clicked, show modal "SORRY BOCHHA LOVEE YOUU NAA 🥺🥺". If second button, go to finale.
- Step 5 (Grand Finale): Celebration page with special message, falling hearts/confetti, celebratory visuals.
- Floating heart particle animation (hearts floating upward continuously) on all pages.
- Soft pink, white romantic aesthetic with playful fonts.
- Background music (looping soft romantic audio if possible with HTML5 audio).

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Build a pure frontend React app with 5 step states managed via useState.
2. Create FloatingHearts component with CSS particle animation (hearts rising from bottom).
3. Create each step as a separate component/view.
4. Step 1: GatekeeperStep with two buttons and conditional denial message.
5. Step 2: RevealStep with romantic text about Muskan and placeholder image area.
6. Step 3: ApologyStep with apology message and two verdict buttons.
7. Step 4: Modal overlay triggered by first verdict button.
8. Step 5: FinaleStep with confetti/falling hearts and special message.
9. Add background music via HTML5 audio element (autoplay on first click interaction).
10. Style with Tailwind + custom CSS for romantic pink/white aesthetic, cursive fonts, gradients.
