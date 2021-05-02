const insertionSort = (
    elements: number[],
    swapElems: (i: number, j: number) => void,
    markColoredElems: (i: number, j: number) => void,
) => {
    let arr = elements.slice(0);
    let j = 0;
    let hold;
    for (let i = 1; i < arr.length; i++) {
        j = i - 1;
        while (j >= 0 && arr[j] > arr[j + 1]) {
            hold = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = hold;
            markColoredElems(j, j + 1);
            swapElems(j, j + 1);
            j--;
        }
    }
};

export default insertionSort;
