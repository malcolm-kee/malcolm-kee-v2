import Head from 'next/head'

export interface SeoProps {
    title?: string;
    children?: React.ReactNode;
}

export const Seo = ({title = 'Malcolm Kee', children}: SeoProps) => (
    <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        {children}
    </Head>
)