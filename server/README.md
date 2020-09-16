How to run:
=

```
npm install
npm test
```

Implementation notes:
=

For the sake of simplicity, I assume referencial equality.
This can be change to work with deep equality using `stringify`, or a simpler hashing method.

__________

`Init` is basically the `Graph` constructor.
`FindMinRelationLevel` is the `findMinRelationLevel` of the `Graph` class.