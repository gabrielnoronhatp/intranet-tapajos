/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        serverComponentsExternalPackages: ['sequelize'],
    },
    // Nova configuração para resolver o erro de minificação
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.minimizer.forEach((plugin) => {
                if (plugin.constructor.name === 'TerserPlugin') {
                    plugin.options.terserOptions.keep_classnames = true;
                    plugin.options.terserOptions.keep_fnames = true;
                }
            });
        }
        return config;
    },
};

module.exports = nextConfig;
