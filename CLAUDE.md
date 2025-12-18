# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite project displaying an interactive 3D Christmas tree scene using Three.js. The tree features animated ornaments, twinkling lights, falling snow, and presents. Users can interact with the scene by moving their mouse to change the camera perspective.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

- **React 19** with Vite 7
- **Three.js** for 3D rendering
- **Tailwind CSS v4.1** (via @tailwindcss/vite plugin)
- ESLint with React Hooks and React Refresh plugins

## Architecture

The app is a single-page 3D scene:

- `src/main.jsx` - React entry point with StrictMode
- `src/App.jsx` - Renders the ChristmasTree component
- `src/components/ChristmasTree.jsx` - Main component containing all Three.js scene setup, 3D objects, and animations in a single useEffect

The ChristmasTree component creates a complete Three.js scene including:

- Scene with fog and lighting (ambient, directional moonlight, point lights)
- Tree built from cone geometries with a cylinder trunk
- Animated elements: ornaments (pulsing), lights (twinkling), star (glowing), snowflakes (falling)
- Mouse-based camera movement for interactivity
- Window resize handling

## ESLint Configuration

Custom rule: `no-unused-vars` ignores variables starting with uppercase or underscore (pattern: `^[A-Z_]`)
