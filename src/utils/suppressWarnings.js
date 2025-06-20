export function suppressWarnings() {
    if (process.env.NODE_ENV !== "development") return;
    console.warn = () => { };

}
