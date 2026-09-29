---
title: "Infisical"
description: "Secrets management for wishly"
sidebar:
  label: Overview
  order: 0
---

Using aws & infisical integration to dynamically sync infisical secrets into aws secrets manager (1 secret). 90% cheaper.


 Create the role Infisical assumes

IAM → Roles → Create role (IAM is global; no region selector to worry about)

1. Trusted entity type: AWS account
2. Select Another AWS account, Account ID: 381492033652
3. Under Options, tick Require external ID, and enter:
8cbc2c7e-fa27-4e37-b3c9-15642fc8ca08
4. Next. Skip the permissions page entirely — don't attach anything, we'll add an inline policy after.
5. Role name: wishly-infisical-sync
6. Create role