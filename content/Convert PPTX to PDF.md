---
Created: 2025-06-07T15:50
Type: Fun Fact
tags:
  - pc_tips
Links:
---
## Convert PPTX to PDF

```python
python -m pip install pptxtopdf
```

## Example in script

```python
from pptxtopdf import convert

input_dir = r"C:\Users\Example\ExampleDirectory"
output_dir = r"C:\Users\Example\ExampleDirectory"

convert(input_dir, output_dir)
```
---
#### Related Concepts

#### Source

https://pypi.org/project/pptxtopdf/