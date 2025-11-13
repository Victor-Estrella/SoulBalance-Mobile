export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const uid = () => Math.random().toString(36).slice(2, 10);
