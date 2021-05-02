const mergeSort = (
    elements: number[],
    insertElement: (i: number, j: number) => void,
    markColoredElems: (i: number, j: number) => void,
) => {
    mergeSortCall();

    function merge(arr: Array<number>, start: number, middle: number, end: number) {
        let left = [];
        let right = [];
        let i = 0;
        let j = 0;
        let hold;
        for (let i = start; i <= middle; i++) {
            left.push(arr[i]);
        }
        for (let i = middle + 1; i <= end; i++) {
            right.push(arr[i]);
        }
        while (left.length !== 0 && right.length !== 0) {
            markColoredElems(start + i, middle + 1 + j);
            if (left[0] < right[0]) {
                hold = left.splice(0, 1)[0];
                arr[start + i + j] = hold;
                insertElement(start + i + j, hold);
                i++;
            } else {
                hold = right.splice(0, 1)[0];
                arr[start + i + j] = hold;
                insertElement(start + i + j, hold);
                j++;
            }
        }
        while (left.length !== 0) {
            hold = left.splice(0, 1)[0];
            arr[start + i + j] = hold;
            insertElement(start + i + j, hold);
            i++;
        }
        while (right.length !== 0) {
            hold = right.splice(0, 1)[0];
            arr[start + i + j] = hold;
            insertElement(start + i + j, hold);
            j++;
        }
    }

    function mergeSortRecurse(arr: Array<number>, start = 0, end = elements.length - 1) {
        if (start >= end) return;
        let middle = Math.floor((end + start) / 2);
        mergeSortRecurse(arr, start, middle);
        mergeSortRecurse(arr, middle + 1, end);
        merge(arr, start, middle, end);
    }

    function mergeSortCall() {
        mergeSortRecurse(elements.slice(0));
    }
};

export default mergeSort;
