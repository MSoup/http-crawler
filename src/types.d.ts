interface IPages {
    [Key: string]: number;
}

interface OutputIPages {
    readonly url: string;
    readonly visits: number;
}

export { IPages, OutputIPages }