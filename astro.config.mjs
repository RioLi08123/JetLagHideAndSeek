// @ts-check
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
const isCloudflarePages = Boolean(process.env.CF_PAGES);
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isJetLagRepo =
    typeof process.env.GITHUB_REPOSITORY === "string" &&
    process.env.GITHUB_REPOSITORY.toLowerCase().endsWith("/jetlaghideandseek");
const isGitHubPages =
    Boolean(process.env.GITHUB_PAGES) ||
    process.env.DEPLOY_TARGET === "github-pages" ||
    (isGitHubActions && isJetLagRepo);

export default defineConfig({
    // This repo was originally configured for GitHub Pages (served from a subpath).
    // Cloudflare Pages serves from `/` by default, so we pick sane defaults based on
    // the deployment environment to avoid broken asset URLs.
    //
    // Override knobs (any environment):
    // - PUBLIC_BASE_PATH (or BASE_PATH): e.g. "/", "/JetLagHideAndSeek"
    // - PUBLIC_SITE_URL (or SITE_URL): full origin, used for sitemaps/meta/PWA helpers
    site:
        process.env.PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        process.env.CF_PAGES_URL ||
        (isGitHubPages ? "https://taibeled.github.io" : undefined),
    base:
        process.env.PUBLIC_BASE_PATH ||
        process.env.BASE_PATH ||
        (isCloudflarePages ? "/" : isGitHubPages ? "/JetLagHideAndSeek" : "/"),
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        AstroPWA({
            manifest: {
                name: "Jet Lag Hide and Seek Map Generator",
                short_name: "Map Generator",
                description:
                    "Automatically generate maps for Jet Lag The Game: Hide and Seek with ease! Simply name the questions and watch the map eliminate hundreds of possibilities in seconds.",
                icons: [
                    {
                        src: "https://taibeled.github.io/JetLagHideAndSeek/JLIcon.png",
                        sizes: "1080x1080",
                        type: "image/png",
                    },
                    {
                        src: "https://taibeled.github.io/JetLagHideAndSeek/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "https://taibeled.github.io/JetLagHideAndSeek/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                theme_color: "#1F2F3F",
            },
        }),
    ],
    devToolbar: {
        enabled: false,
    },
});
