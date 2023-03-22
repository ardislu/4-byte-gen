// From noble-hashes v1.3.0
import { keccak256 } from '/keccak256.js';
const encoder = new TextEncoder();

function validate(functionName, minimum) {
  const byteArray = keccak256(encoder.encode(functionName)).slice(0, 4);
  for (let i = 0; i < minimum; i++) {
    if (byteArray[i] === 0) {
      if (i + 1 === minimum) {
        const hash = `0x${[...byteArray].map(b => b.toString(16).padStart(2, '0')).join('')}`;
        return hash;
      }
    }
    else {
      return false;
    }
  }
}

function calculateOptimizedName(name, parametersTypes, minimum) {
  let counter = 0n;
  let functionName = `${name}_${counter}(${parametersTypes})`;
  let hash = validate(functionName, minimum);
  while (!hash) {
    counter++;
    functionName = `${name}_${counter.toString(36)}(${parametersTypes})`;
    hash = validate(functionName, minimum);
  }
  return { functionName, hash, counter };
}

addEventListener('message', e => {
  const { name, parametersTypes, minimum } = e.data;
  const { functionName, hash, counter } = calculateOptimizedName(name, parametersTypes, minimum);
  postMessage({ functionName, hash, counter });
});
