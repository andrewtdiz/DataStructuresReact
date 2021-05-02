const breadthFirstCheck = (graphHold: Array<Array<number>>) => {
    let i = 0;
    let unique = [0];
    let hold;
    let a;
    while (i !== unique.length) {
        a = (uniqueHold: Array<number>, j: number) => graphHold[j].slice(2).filter((val) => !uniqueHold.includes(val));
        hold = a(unique.slice(0), unique[i]);
        unique = [...unique, ...hold];
        i++;
    }
    return unique.length === graphHold.length;
};

export default breadthFirstCheck;
