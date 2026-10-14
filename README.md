# Cannonball

A dependency-free projectile-motion worksheet inspired by the supplied design. Includes per-variable numeric and unit checking, on-demand hints for every variable and final question, a touch/mouse sketch pad with undo and eraser, typed working, the big five kinematics equations with solve-for guidance, and randomized practice problems unlocked after all 17 answers are correct.

Use signed velocities and upward-positive acceleration. Vertical quantities cover the rise; horizontal quantities cover the total flight. Answers accept 1% relative error or 0.015 absolute error for rounding. Problems use 9.81 m/s² and equal launch/landing heights. Progress and work are session-only and reset on reload.

## Run locally

Run `python3 -m http.server 8000`, then open http://localhost:8000. ES modules require serving over HTTP rather than opening the HTML file directly.

Run checks with `node --test physics.test.mjs`.

## GitHub Pages

Push these files to the `main` branch. In GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. The included workflow tests the physics and deploys the static site. For this repository the URL will be https://mikah1.github.io/Hudl/ after a successful deployment. All asset URLs are relative, so project-site hosting works without configuration.
