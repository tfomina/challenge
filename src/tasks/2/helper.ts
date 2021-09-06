export const parseDate = (created: string) => {
    const date = new Date(created);

    const year = date.getFullYear();
    const month =
        date.getMonth() < 9
            ? `0${date.getMonth() + 1}`
            : `${date.getMonth() + 1}`;
    const day = date.getDay() < 10 ? `0${date.getDay()}` : `${date.getDay()}`;

    const hours =
        date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const minutes =
        date.getMinutes() < 10
            ? `0${date.getMinutes()}`
            : `${date.getMinutes()}`;
    const seconds =
        date.getSeconds() < 10
            ? `0${date.getSeconds()}`
            : `${date.getSeconds()}`;

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
