# PAL-IN
A simple React + TypeScript demo for loading and saving pallet projects.

The React application lives in the `pal-in/` directory.

## Getting Started

Install dependencies:

```bash
cd pal-in
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

Run the unit tests verifying JSON import/export logic:

```bash
npm test
```

## Build

Create a production build:

```bash
npm run build
```


## Example Project

A sample pallet project JSON is provided in `examples/sample-project.json`. Load this file in the demo application to quickly verify that loading and saving work.

When creating your own JSON files, include a `"units"` field at the top level to
choose between millimetres (`"mm"`) and inches (`"inch"`). All dimension values
use these units.

## Command-line Pattern Generator

For simple offline generation of pallet patterns, a Python script
`palletizer.py` is provided at the repository root. It can create pallet
project JSON files similar to those used by the web demo. Example usage:

```bash
python3 palletizer.py \
  --pallet-length 1200 --pallet-width 800 --pallet-height 180 \
  --box-length 450 --box-width 310 --box-height 278 --box-weight 4000 \
  --layers 5 --alternate --name "o0122 5k4w" \
  --output examples/generated-project.json
```

The script produces a project file containing a single grid layer type
and, when `--alternate` is used, a mirrored alternative layout for
alternating layers. The generated JSON can be loaded in the demo
application for further editing.
