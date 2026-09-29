---
title: "Git Flow"
description: "custom macro"
---

### custom macro to speed up git cli

```bash
git flow
```
this allows us to run all these at man
- `git add .`
- `git commit -m "message"`
- `git push`


here is the config 

```bash

[user]
        email = gavinfancher02@gmail.com
        name = Gavin Fancher

[alias]
        flow = "!f() { \
                read -rp 'Enter commit message: ' msg; \
                if [ -z \"$msg\" ]; then \
                        echo 'Commit message cannot be empty.'; \
                        return 1; \
                fi; \
                git add .; \
                git commit -m \"$msg\"; \
                git push; \
        }; f"