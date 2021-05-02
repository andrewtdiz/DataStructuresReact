const breadthFirstSearch = (
    graphHold: Array<Array<number>>,
    start = 0,
    end = graphHold.length - 1,
    addSelectedCommand: (selected: Array<number>) => void,
) => {
    let unique = [start];
    let hold;
    let a;
    for (let i = 0; i < unique.length; i++) {
        a = (uniqueHold: Array<number>, j: number) => graphHold[j].slice(2).filter((val) => !uniqueHold.includes(val));
        hold = a(unique.slice(0), unique[i]);
        for (let j = 0; j < hold.length; j++) {
            unique.push(hold[j]);
            addSelectedCommand(unique.slice(0));
            if (hold[j] === end) return;
        }
    }
    return;
};

export default breadthFirstSearch;
