const depthFirstSearch = (
    graphHold: Array<Array<number>>,
    start: number,
    end: number,
    addSelectedCommand: (selected: Array<number>) => void,
) => {
    if (graphHold.length === 0) return;
    let stack = [start];
    addSelectedCommand(stack.slice(0));
    let unique = [start];
    let hold;
    while (stack.length !== graphHold.length) {
        if (graphHold[stack[stack.length - 1]].length > 2) {
            hold = graphHold[stack[stack.length - 1]].splice(2, 1)[0];
            if (!unique.includes(hold)) {
                stack.push(hold);
                unique.push(hold);
                addSelectedCommand(stack.slice(0));
            }
            if (hold === end) {
                break;
            }
        } else {
            stack.pop();
            addSelectedCommand(stack.slice(0));
        }
    }
};

export default depthFirstSearch;
