module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint-config-airbnb-base',
        'plugin:flowtype/recommended',
    ],
    plugins: [
        'import',
        'flowtype',
    ],
    settings: {
        ecmascript: 6
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            arrowFunctions: true,
            binaryLiterals: true,
            blockBindings: true,
            classes: true,
            defaultParams: true,
            destructuring: true,
            forOf: true,
            generators: true,
            modules: true,
            objectLiteralComputedProperties: true,
            objectLiteralDuplicateProperties: true,
            objectLiteralShorthandMethods: true,
            objectLiteralShorthandProperties: true,
            octalLiterals: true,
            regexUFlag: true,
            regexYFlag: true,
            spread: true,
            superInFunctions: true,
            templateStrings: true,
            unicodeCodePointEscapes: true,
            globalReturn: true
        }
    },
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    rules: {
        'max-len': [2, 80, 4, { 'ignoreUrls': true }],
        // Since I develop on both Windows and Mac, I don't want to have to keep
        // fixing this:
        'linebreak-style': 0,
        /*
         Airbnb Style Overrides:
         Airbnb specifies 2 tabs, but I prefer 4. I'm not a fan of the way
         they handle switch indenting either:
         */
        'arrow-body-style': [0, 'as-needed'],
        'indent': [1, 4, { 'SwitchCase': 1 }],
        'import/default': 0,
        'import/extensions': 0,
        'import/no-duplicates': 1,
        'import/no-extraneous-dependencies': 0,
        'import/named': 0,
        'import/namespace': [0, { 'allowComputed': true }],
        'import/no-named-as-default': 0,
        'import/no-named-as-default-member': 0,
        'import/no-unresolved': 0,
        'no-console': 1,
        'no-debugger': 1,
        'no-param-reassign': 0,
        'semi': [1, 'always'],
        'no-trailing-spaces': 1,
        'eol-last': 0,
        'no-unused-vars': 1,
        'no-underscore-dangle': 2,
        'no-alert': 0,
        'no-lone-blocks': 0
    }
};
