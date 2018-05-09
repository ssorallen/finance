# Finance!

A fast, free, in-browser stock portfolio manager that you can deploy anywhere. You can use the version
deployed at https://ssorallen.github.io/finance/ or [deploy your own](#deploy-your-own).

## Importing Your Portfolio

If you have a spreadsheet (.csv) file containting transactions in your portfolio, you can import the
entire file at once in Finance!.

1. Click the "Import Portfolio" link in the upper right-ish area of any page
2. Select your portfolio file
   * If you're importing a Google Finance portfolio the file is potentially called
     _"My Portfolio.csv"_ since that was the default. Otherwise the filename will be whatever your
     portfolio was called in Google Finance.
3. Click "Open"
4. 🎉🎉🎉

### Data Format

Your portfolio CSV file is expected to have the following columns:

```
Symbol,Name,Type,Date,Shares,Price,'Cash value',Commission,Notes
```

the values should be of the following types:

```
{
  'Cash value': ?number,
  Commission: number,
  Date: ?string,
  Name: ?string,
  Notes: ?string,
  Price: number,
  Shares: number,
  Symbol: string,
  Type: 'Buy' | 'Sell',
}
```

Other formats are currently not supported, and Finance! might fall apart if you try to use another
format.

#### Google Finance Portfolios

If you exported your Google Finance portfolio to a spreadsheet (.csv) file before the site shut
down, you can easily import that file into Finance! The data format is fully supported, so jump up
to [Importing Your Portfolio](#importing-your-portfolio) and follow the steps.

## Exporting your portfolio

1. Click the "Download to spreadsheet" button in the upper right-ish area of any page.
2. The file will be called _"My Portfolio.csv"_ and be in the data format described in the
   [Importing Your Portfolio](#importing-your-portfolio) section.

## Data Privacy

Finance! doesn't collect or store any of your data. Actually, Finance! has no server of any kind,
the entire app runs inside your browser.

### What does Finance! do with my transaction data?

Transaction data and which symbols you're watching is stored entirely in your browser (using
[local storage][0]). Transaction data is never sent anywhere; it never leaves your computer.

### What data of mine *does* leave my computer?

In order to see the value of your portfolio, a list of the symbols in your portfolio is sent to
[IEX][1] to get the latest quotes for each symbol. *None* of your transaction data is sent to IEX or
to anyone else, only a list of the symbols leaves your computer.

For example, if your portfolio looked like the following:

```
{
  transactions: [
    {symbol: 'GM', price: 100, shares: 100},
    {symbol: 'GM', price: 150, shares: 100},
    {symbol: 'F', price: 50, shares: 100},
    {symbol: 'F', price: 100, shares: 1000},
  ]
}
```

the following data would be sent to IEX:

```
['F', 'GM']
```

That's it. There's no tracking, no advertisements, and no other API requests.

## Stock Data

All stock data is provided for free by [IEX][2]. Use is subject to [IEX Exhibit A][3].

### How do I track market indices?

The IEX API currently does not provide market index data. For more information, check out
[IEX-API Issue #36][5].

The best replacement is ETFs that track associated indices like SPY for the S&P500 and DIA for the
Dow Jones Industrial Average (DJIA).

### Why is there no data for mutual funds?

The IEX API currently does not provide mutual fund data. Please watch [IEX-API Issue #16][4] for
updates on when that data might become available.

## How to Build

1. Clone this repository
2. Use [Yarn][7] to install dependencies

       $ yarn install
3. (Optional) To develop and make changes, use `start`

       $ yarn start
4. Build the app for deployment

       $ yarn build

### Deploy Your Own

All the code necessary to run Finance! is in this repository. There's no database required, no
other application server. Once you [build](#how-to-build) the app, you can copy the static files to
any webserver you like.

#### Using GitHub Pages

If you want to do this all on GitHub and deploy with [GitHub Pages][6], follow these steps:

1. Fork this repo with the "Fork" button in the upper right
2. Clone your new repo to your computer
3. Change the `"homepage"` in package.json to your site's new home,
   https://YOURNAME.github.io/finance/
4. Build the app for release using the [How to Build](#how-to-build) instructions
5. Using the [gh-pages package][8] that's already installed, deploy to your very own page

       $ yarn deploy
6. ✨✨ Your version of Finance! will be available at https://YOURNAME.github.io/finance/ ✨✨

## Inspiration

As an unsophisticated investor, I liked Google Finance and missed the simple interface for managing
a stock portfolio. Alternatives offer more than I need, so I built only the functionality I wanted.

The idea to run this all in a browser was sparked by seeing Todd Schneider's
[toddwschneider/stocks](https://github.com/toddwschneider/stocks) project.

[0]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[1]: https://iextrading.com/
[2]: https://iextrading.com/developer/
[3]: https://iextrading.com/api-exhibit-a/
[4]: https://github.com/iexg/IEX-API/issues/16
[5]: https://github.com/iexg/IEX-API/issues/36
[6]: https://help.github.com/articles/user-organization-and-project-pages/
[7]: https://yarnpkg.com/
[8]: https://github.com/tschaub/gh-pages
