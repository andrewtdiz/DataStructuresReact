const cocktailSort = (
    elements: number[],
    swapElems: (i: number, j: number) => void,
    markColoredElems: (i: number, j: number) => void,
) => {
    let arr = elements.slice(0);
    let hold;
    let passes = 0;
    let count = 0;
    let i = 0;
    let j = arr.length - 1;
    while (i <= j) {
        count = 0;
        if (passes % 2 === 0) {
            for (let k = i; k < j; k++) {
                markColoredElems(k, j);
                if (arr[k] > arr[k + 1]) {
                    count++;
                    hold = arr[k];
                    arr[k] = arr[k + 1];
                    arr[k + 1] = hold;
                    swapElems(k, k + 1);
                }
            }
            if (count === 0) return;
            j--;
        } else {
            for (let k = j; k > i; k--) {
                markColoredElems(k, i);
                if (arr[k] < arr[k - 1]) {
                    count++;
                    hold = arr[k];
                    arr[k] = arr[k - 1];
                    arr[k - 1] = hold;
                    swapElems(k, k - 1);
                }
            }
            if (count === 0) return;
            i++;
        }
        passes++;
    }
};

export default cocktailSort;
