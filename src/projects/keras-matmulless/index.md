_Keras-MatMulLess_ implements Keras layers without using matrix multiplications.

This is a Keras based implementation of some layers mentioned in the papers [The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits](https://arxiv.org/pdf/2402.17764v1) and [Scalable MatMul-free Language Modeling](https://arxiv.org/pdf/2406.02528v5), as an attempt to learn the intricacies behind the layers of many machine learning models.

# Rationale

Traditional, matrix multiplication based layers suffer from a few issues.

- They have high inference and computational costs due to the use of matrix multiplications. This hinders the speed at which inference is performed on GPU-less machines.
- The memory use for storing full precision weights is very high.
- The energy costs of running matrix multiplications is very high.

Matrix multiplication free layers addresses these pain points by removing the key source of costs &mdash; matrix multiplications.
