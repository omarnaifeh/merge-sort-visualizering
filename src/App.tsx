import "./App.css";
import { useState, useEffect } from "react";

type VisualizationStep = {
  leftArray?: number[];
  rightArray?: number[];
  sortedArray: number[];
  comparing?: [number, number];
  replaced?: number;
  final?: boolean;
};

const App = () => {
  const [numbers, setNumbers] = useState<number[]>([
    12, 42, 69, 59, 38, 17, 13, 76, 7, 100, 17, 65, 79, 26, 60, 6, 65, 49, 87,
    92,
  ]);

  const [delay, setDelay] = useState<number>(300);

  const [visualizationSteps, setVisualizationSteps] = useState<
    VisualizationStep[]
  >([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [hasStarted, setStarted] = useState<boolean>(false);

  const mergeSort = (numArrayToSort: number[]): number[] => {
    if (numArrayToSort.length <= 1) return numArrayToSort;

    const middleIndex = Math.floor(numArrayToSort.length / 2);
    const leftArray = numArrayToSort.slice(0, middleIndex);
    const rightArray = numArrayToSort.slice(middleIndex);

    return merge(mergeSort(leftArray), mergeSort(rightArray));
  };

  const merge = (leftArray: number[], rightArray: number[]): number[] => {
    const sortedArray: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
      setVisualizationSteps((prevSteps) => [
        ...prevSteps,
        {
          leftArray,
          rightArray,
          sortedArray: [...sortedArray],
          comparing: [leftIndex, rightIndex],
        },
      ]);

      let replaced: number | undefined;

      if (leftArray[leftIndex] < rightArray[rightIndex]) {
        sortedArray.push(leftArray[leftIndex]);
        replaced = leftArray[leftIndex];
        leftIndex++;
      } else {
        sortedArray.push(rightArray[rightIndex]);
        replaced = rightArray[rightIndex];
        rightIndex++;
      }

      setVisualizationSteps((prevSteps) => [
        ...prevSteps,
        {
          leftArray,
          rightArray,
          sortedArray: [...sortedArray],
          replaced,
        },
      ]);
    }

    setVisualizationSteps((prevSteps) => [
      ...prevSteps,
      {
        leftArray: leftArray.slice(leftIndex),
        rightArray: rightArray.slice(rightIndex),
        sortedArray: [...sortedArray],
      },
    ]);

    return sortedArray
      .concat(leftArray.slice(leftIndex))
      .concat(rightArray.slice(rightIndex));
  };

  const startVisualization = () => {
    setVisualizationSteps([]);
    const sorted = mergeSort(numbers);
    setVisualizationSteps((prevSteps) => [
      ...prevSteps,
      { sortedArray: sorted, final: true },
    ]);
    setCurrentStep(0);
    setStarted(true);
  };

  useEffect(() => {
    if (
      visualizationSteps.length > 0 &&
      currentStep < visualizationSteps.length - 1
    ) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [currentStep, visualizationSteps, delay]);

  const currentVisualization = visualizationSteps[currentStep] || {};
  const stepsLeft = visualizationSteps.length - currentStep - 1;

  useEffect(() => {

    if (stepsLeft === 0)
      setStarted(false)

  }, [stepsLeft]);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold mb-2">Merge Sort Algoritme</h1>
      <p>
        Merge sort er en effektiv "divide and conquer"-sorteringsalgoritme, som
        opdeler en liste i mindre dele, sorterer dem individuelt og derefter
        sammensætter dem i sorteret rækkefølge. Den har en tidskompleksitet på
        O(n log n) og er velegnet til store datasæt.
      </p>
      <p className="mt-2">
        Dette program er udviklet af Omar Naifeh | omar1907
      </p>
      <div className="arrays">
        <div className="array-section">
          <h3>Venstre Array</h3>
          <div className="array-container">
            {(currentVisualization.leftArray || []).map((num, idx) => (
              <div
                key={idx}
                className={`array-bar left ${
                  currentVisualization.replaced === num ? "replaced" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div className="array-section">
          <h3>Højre Array</h3>
          <div className="array-container">
            {(currentVisualization.rightArray || []).map((num, idx) => (
              <div
                key={idx}
                className={`array-bar right ${
                  currentVisualization.replaced === num ? "replaced" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div className="array-section">
          <h3>Sorteret Array</h3>
          <div className="array-container">
            {(currentVisualization.sortedArray || []).map((num, idx) => (
              <div
                key={idx}
                className={`array-bar sorted ${
                  currentVisualization.replaced === num ? "replaced" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!hasStarted && (
        <button className="mt-10" onClick={startVisualization}>
          Start Visualisering
        </button>
      )}

      {stepsLeft > 0 && (
        <div className="mt-10 font-bold">
          <p>Skridt tilbage: {stepsLeft}</p>
        </div>
      )}

      <div className="absolute top-10 left-10">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-bold text-start">Talrække</h1>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Indsæt talrække"
            value={numbers.join(", ")}
            rows={4}
            cols={4}
            disabled={stepsLeft > 0}
            onChange={(e) => {
              const newNumbers = e.target.value
                .split(",")
                .map((num) => num.trim())
                .filter((num) => !isNaN(Number(num)))
                .map((num) => Number(num));
              setNumbers(newNumbers);
            }}
          ></textarea>
          <div className="flex flex-col gap-y-4">
            <h1 className="font-bold text-start">Hastighed</h1>
            <input
              type="range"
              min="100"
              max="1000"
              value={delay}
              className="range"
              step="1"
              onChange={(e) => setDelay(parseInt(e.target.value))}
            />
          </div>
          <div className="flex w-full justify-between px-2 text-xs">
            <span>100 ms</span>
            <span>1000 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
