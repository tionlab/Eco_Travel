import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import fs from 'fs';
import path from 'path';

const Preloader = ({ pages, publicData }) => {
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        let loaded = 0;
        const total = pages.length + publicData.length;
        const incrementProgress = (resource) => {
            loaded += 1;
            setProgress((loaded / total) * 100);
        };

        pages.forEach((page) => {
            fetch(page)
                .then(() => incrementProgress(page))
                .catch(() => incrementProgress(page));
        });

        publicData.forEach((data) => {
            fetch(data)
                .then(() => incrementProgress(data))
                .catch(() => incrementProgress(data));
        });
    }, [pages, publicData]);

    useEffect(() => {
        if (progress === 100) {
            router.push('/login');
        }
    }, [progress, router]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <img src="/logo.png" alt="Logo" style={{ marginBottom: '20px' }} />
            <div style={{ width: '80%', backgroundColor: '#e0e0e0' }}>
                <div
                    style={{
                        width: `${progress}%`,
                        height: '30px',
                        backgroundColor: progress < 100 ? '#3b82f6' : '#10b981',
                        transition: 'width 0.5s',
                    }}
                />
            </div>
        </div>
    );
};

export async function getStaticProps() {
    const getPages = (dir) => {
        const pagePaths = [];
        const walkSync = (dir) => {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    walkSync(filePath);
                } else if (
                    (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) &&
                    !file.includes('_app') &&
                    !file.includes('_document') &&
                    !file.includes('download')
                ) {
                    const relativePath = filePath
                        .replace(process.cwd() + path.sep + 'pages', '')
                        .replace(/\\+/g, '/')
                        .replace(/\.js$|\.jsx$|\.ts$|\.tsx$/, '');
                    pagePaths.push(relativePath === '/index' ? '/' : relativePath);
                }
            });
        };
        walkSync(dir);
        return pagePaths;
    };

    const getPublicData = (dir) => {
        const publicDataPaths = [];
        const walkSync = (dir) => {
            fs.readdirSync(dir).forEach((file) => {
                if (!file.endsWith('.apk')) {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        walkSync(filePath);
                    } else {
                        publicDataPaths.push(
                            filePath.replace(process.cwd() + path.sep + 'public', '').replace(/\\+/g, '/')
                        );
                    }
                }
            });
        };
        walkSync(dir);
        return publicDataPaths;
    };

    const pages = getPages(path.join(process.cwd(), 'pages'));
    const publicData = getPublicData(path.join(process.cwd(), 'public'));

    return {
        props: {
            pages,
            publicData,
        },
    };
}

export default Preloader;
