function maskPhone(d: string) {
    if (!d) return "";
    if (d.length <= 2) return d;
    if (d.length <= 7)
        return `(${d.slice(0, 2)}) ${d.slice(2)}`;

    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

export default maskPhone;