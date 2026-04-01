

## Changes

### 1. Login with credential validation
Add validation in `Login.tsx` to only allow `teste@teste.com` / `123456`. Show error message for invalid credentials.

### 2. Replace green (#3B6D11) with teal (#01999c)
`#01999c` in HSL ≈ `181 99% 30%`. Update all green-based CSS variables in `src/index.css`:

- `--primary`: `181 99% 30%`
- `--secondary`: `181 70% 40%`
- `--muted`: `181 40% 90%`
- `--accent`: `181 45% 85%`
- `--accent-foreground`: `181 99% 30%`
- `--success`: `181 99% 30%`
- `--border`: `181 20% 85%`
- `--input`: `181 20% 85%`
- `--ring`: `181 99% 30%`

Files changed: `src/pages/Login.tsx`, `src/index.css`

