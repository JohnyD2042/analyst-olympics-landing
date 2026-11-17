import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidContact } from "./contact";
test("accepts e-mail", () => assert.equal(isValidContact("you@example.com"), true));
test("accepts Telegram handle with @", () => assert.equal(isValidContact("@analyst_pro"), true));
test("rejects handle without @", () => assert.equal(isValidContact("analyst_pro"), false));
test("rejects too short handle", () => assert.equal(isValidContact("@abc"), false));
