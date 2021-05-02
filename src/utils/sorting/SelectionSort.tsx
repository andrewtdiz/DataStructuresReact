const selectionSort = (
    elements: number[],
    swapElems: (i: number, j: number) => void,
    markColoredElems: (i: number, j: number) => void,
) => {
    let least;
    let leastInd = 0;
    let arr = elements.slice(0);
    let hold;
    for (let i = 0; i < arr.length; i++) {
        least = Infinity;
        for (let j = i; j < arr.length; j++) {
            if (arr[j] < least) {
                least = arr[j];
                leastInd = j;
            }
            markColoredElems(leastInd, j);
        }
        hold = arr[i];
        arr[i] = arr[leastInd];
        arr[leastInd] = hold;
        swapElems(i, leastInd);
    }
};

export default selectionSort;
