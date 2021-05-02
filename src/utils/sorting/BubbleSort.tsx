import React from 'react';

const bubbleSort = (elements: number[], setCommands: React.Dispatch<React.SetStateAction<number[][]>>) => {
    let hold;
    let count = 0;
    let arr = elements.slice(0);
    for (let i = arr.length - 1; i >= 1; i--) {
        count = 0;
        for (let j = 0; j < i; j++) {
            count++;
            setCommands((oldState) => [...oldState, [0, j, j + 1]]);
            if (arr[j] > arr[j + 1]) {
                hold = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = hold;
                setCommands((oldstate) => [...oldstate, [1, j, j + 1]]);
            }
        }
        if (count === 0) return;
    }
};

export default bubbleSort;
