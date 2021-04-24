# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.3.0...mugshot@4.0.0) (2021-04-24)


### Bug Fixes

* **deps:** update dependency @types/is-ci to v3 ([e19b61c](https://github.com/NiGhTTraX/mugshot/commit/e19b61c6f719ba6d564a04e87632ae431953d5e0))
* **deps:** update dependency @types/node to ~10.17.0 ([2d244ca](https://github.com/NiGhTTraX/mugshot/commit/2d244ca60a1d341c4aeabd87e2f3ab6b7ff3c66d))
* **deps:** update dependency fs-extra to ~9.1.0 ([c24e935](https://github.com/NiGhTTraX/mugshot/commit/c24e93512c51d810426f9cb6e60ec8d9b50c9d3f))
* **deps:** update dependency is-ci to v3 ([b36679a](https://github.com/NiGhTTraX/mugshot/commit/b36679a5f3c74aad371beb81e5a8d61fc047a591))


### Code Refactoring

* Rename interface method ([48b6ccc](https://github.com/NiGhTTraX/mugshot/commit/48b6ccc0c2dc086290283f870895b8d6a0e169b7))
* Use named exports ([d70775f](https://github.com/NiGhTTraX/mugshot/commit/d70775f4f04f4faf92ccb3c4b6608ee734562e91))


### Features

* **mugshot:** Add basic constructor ([a482f74](https://github.com/NiGhTTraX/mugshot/commit/a482f743a9a18eac8bf120343e2bad1ff1fd9913))


### BREAKING CHANGES

* The `takeScreenshot` method on the `Webdriver`
interface has been renamed to `takeViewportScreenshot` to better reflect
its usage.
* Default exports are no more and everything is a named
export now. This improves the generated docs and should also help with
IDE autocomplete.





# [3.3.0](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.2.0...mugshot@3.3.0) (2020-12-29)


### Features

* **mugshot:** Allow ignore color to be customized ([d56c9c6](https://github.com/NiGhTTraX/mugshot/commit/d56c9c6))





# [3.2.0](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.1.0...mugshot@3.2.0) (2020-09-09)


### Bug Fixes

* **mugshot:** Mark non-intersecting areas with config diff color ([f76c769](https://github.com/NiGhTTraX/mugshot/commit/f76c769))
* **mugshot:** Only mark pixels belonging to images with diff color ([6be6751](https://github.com/NiGhTTraX/mugshot/commit/6be6751))


### Features

* **mugshot:** Return the diff percentage ([694c295](https://github.com/NiGhTTraX/mugshot/commit/694c295))





# [3.1.0](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.0.0...mugshot@3.1.0) (2020-09-07)


### Features

* **contracts:** Move test helper here and export it ([a598687](https://github.com/NiGhTTraX/mugshot/commit/a598687))





# [3.0.0](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.0.0-alpha.1...mugshot@3.0.0) (2020-09-05)


### Features

* **mugshot:** Handle throwing `ElementNotFound` and `ElementNotVisible` ([463bcc2](https://github.com/NiGhTTraX/mugshot/commit/463bcc2))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.





# [3.0.0-alpha.3](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.0.0-alpha.2...mugshot@3.0.0-alpha.3) (2020-09-05)

**Note:** Version bump only for package mugshot





# [3.0.0-alpha.2](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.0.0-alpha.1...mugshot@3.0.0-alpha.2) (2020-09-05)


### Features

* **mugshot:** Handle throwing `ElementNotFound` and `ElementNotVisible` ([463bcc2](https://github.com/NiGhTTraX/mugshot/commit/463bcc2))


### Tests

* Remove text from UI fixtures ([23a19d1](https://github.com/NiGhTTraX/mugshot/commit/23a19d1))


### BREAKING CHANGES

* there should be no changes on the `Webdriver` contract
tests, but if you were using `loadFixture` to set up screenshot tests
then those will most likely fail after this.





# [3.0.0-alpha.1](https://github.com/NiGhTTraX/mugshot/compare/mugshot@3.0.0-alpha.0...mugshot@3.0.0-alpha.1) (2020-08-30)


### Bug Fixes

* **deps:** update dependency @types/fs-extra to v9 ([b724d89](https://github.com/NiGhTTraX/mugshot/commit/b724d89))
* **deps:** update dependency fs-extra to v9 ([f9c0645](https://github.com/NiGhTTraX/mugshot/commit/f9c0645))
* **deps:** update dependency jimp to ~0.10.0 ([27082ef](https://github.com/NiGhTTraX/mugshot/commit/27082ef))
* **deps:** update dependency jimp to ~0.12.0 ([0476077](https://github.com/NiGhTTraX/mugshot/commit/0476077))
* **deps:** update dependency jimp to ~0.13.0 ([e595da0](https://github.com/NiGhTTraX/mugshot/commit/e595da0))
* **deps:** update dependency jimp to ~0.14.0 ([03f5d08](https://github.com/NiGhTTraX/mugshot/commit/03f5d08))
* **deps:** update dependency jimp to ~0.15.0 ([6c83b36](https://github.com/NiGhTTraX/mugshot/commit/6c83b36))
* **deps:** update dependency jimp to ~0.16.0 ([726d036](https://github.com/NiGhTTraX/mugshot/commit/726d036))
