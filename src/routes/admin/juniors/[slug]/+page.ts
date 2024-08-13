export const load: any = ({ params }) => {
    return {
        props: {
        slug: params.slug,
        page: parseInt(params.page),
        },
    };
};