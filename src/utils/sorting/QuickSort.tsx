const quickSort = (
    elements: number[],
    swapElems: (i: number, j: number) => void,
    markColoredElems: (i: number, j: number) => void,
) => {
    quickSortCall();

    function quickSortPartition(arr: Array<number>, start: number, end: number) {
        let hold;
        let x = arr[end];
        let i = start - 1;
        for (let j = start; j < end; j++) {
            markColoredElems(j, j + 1);
            if (arr[j] <= x) {
                i++;
                hold = arr[i];
                arr[i] = arr[j];
                arr[j] = hold;
                swapElems(i, j);
            }
        }
        hold = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = hold;
        swapElems(i + 1, end);
        return i + 1;
    }

    function quickSortRecurse(elem: Array<number>, start = 0, end = elem.length - 1) {
        if (end <= start) return;
        let pivot;
        pivot = quickSortPartition(elem, start, end);
        quickSortRecurse(elem, start, pivot - 1);
        quickSortRecurse(elem, pivot + 1, end);
        return;
    }

    function quickSortCall() {
        quickSortRecurse(elements.slice(0));
    }
};

export default quickSort;
