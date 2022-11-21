import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import MainContentBlocksCategories from "../../components/main-content-blocks/MainContentBlocksCategories";
import SideMenuCategories from "../../components/side-menu/SideMenuCategories";

const storiesCategoryPage = () => {
    // Router
    const router = useRouter();
    const categorySelectedName = router.query.storiesCategory as string;

    return (
        <Fragment>
            {categorySelectedName && (
                <div className="content">
                    <SideMenuCategories categorySelectedName={categorySelectedName} />
                    <MainContentBlocksCategories
                        categorySelectedName={categorySelectedName}
                    />
                </div>
            )}
        </Fragment>
    );
};

export default storiesCategoryPage;
