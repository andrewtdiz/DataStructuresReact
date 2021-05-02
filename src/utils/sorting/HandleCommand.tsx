import { FREQUENCIES } from '../../constants/Sorting';
import * as Tone from 'tone';

const handleCommand = (
    i: number,
    commands: number[][],
    playing: boolean,
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    setColoredElements: React.Dispatch<React.SetStateAction<number[]>>,
    setElements: React.Dispatch<React.SetStateAction<number[]>>,
    setLoc: (value: React.SetStateAction<number>) => void,
    osc: Tone.Oscillator | undefined,
) => {
    let freq;
    if (i >= commands.length) {
        setPlaying(false);
        setColoredElements([-1, -1]);
        return;
    }
    let [method, first, second] = commands[i];
    if (method === 0) {
        setColoredElements([first, second]);
    } else if (method === 1) {
        setElements((prevState) => {
            if (osc !== undefined) {
                freq =
                    FREQUENCIES[
                        Math.abs(
                            Math.floor(
                                ((prevState[first] - prevState[second]) / prevState.length) * FREQUENCIES.length,
                            ),
                        )
                    ];
                osc.set({
                    frequency: freq,
                });
            }
            let hold = prevState[first];
            prevState[first] = prevState[second];
            prevState[second] = hold;
            return prevState;
        });
    } else {
        setElements((prevState) => {
            if (osc !== undefined) {
                osc.set({
                    frequency: FREQUENCIES[Math.abs(Math.floor((second / prevState.length) * FREQUENCIES.length))],
                });
            }
            prevState[first] = second;
            return prevState;
        });
    }
    if (playing) setLoc((prevLoc) => prevLoc + 1);
};

export default handleCommand;
