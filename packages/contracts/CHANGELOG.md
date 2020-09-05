# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.2](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.1...@mugshot/contracts@3.0.0-alpha.2) (2020-09-05)


### Features

* **contracts:** Add screenshot tests for the `Webdriver` contract ([c93bbfc](https://github.com/NiGhTTraX/mugshot/commit/c93bbfc))
* **contracts:** Update tests for new `Webdriver` interface ([61269be](https://github.com/NiGhTTraX/mugshot/commit/61269be))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* **contracts:** ideally there should be no breaking changes, but the
new screenshot tests might produce differences in some browsers.

All existing adapters have been migrated to the new tests.
* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.





# [3.0.0-alpha.1](https://github.com/NiGhTTraX/mugshot/compare/@mugshot/contracts@3.0.0-alpha.0...@mugshot/contracts@3.0.0-alpha.1) (2020-08-30)


### Bug Fixes

* **deps:** update dependency jimp to ~0.10.0 ([27082ef](https://github.com/NiGhTTraX/mugshot/commit/27082ef))
* **deps:** update dependency jimp to ~0.12.0 ([0476077](https://github.com/NiGhTTraX/mugshot/commit/0476077))
* **deps:** update dependency jimp to ~0.13.0 ([e595da0](https://github.com/NiGhTTraX/mugshot/commit/e595da0))
* **deps:** update dependency jimp to ~0.14.0 ([03f5d08](https://github.com/NiGhTTraX/mugshot/commit/03f5d08))
* **deps:** update dependency jimp to ~0.15.0 ([6c83b36](https://github.com/NiGhTTraX/mugshot/commit/6c83b36))
* **deps:** update dependency jimp to ~0.16.0 ([726d036](https://github.com/NiGhTTraX/mugshot/commit/726d036))
* **deps:** update dependency jimp to ~0.9.0 ([46f8c99](https://github.com/NiGhTTraX/mugshot/commit/46f8c99))
