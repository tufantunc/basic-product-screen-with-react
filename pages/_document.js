import Document, { Head, Main, NextScript } from 'next/document';

class PageDocument extends Document {
    render() {
        return (
            <html lang="tr">
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </html>
        );
    }
}

export default PageDocument;