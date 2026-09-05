"use client";


import { remarkList } from "@/dummyData/productList";
import { Remark } from "@/types/remark";
import { Button } from "@/components/ui/button";
import {JSX, useState} from "react";
import RelatedProduct from "../product/RelatedProduct";

const RemarkTab = () => {
    const [remarkState, setRemarkState] = useState<string | null>(remarkList[0]?.name || null);

    return (
        <>
            <div className="flex justify-center items-center gap-1 md:gap-4 pb-3">
                {remarkList.map((remark: Remark): JSX.Element => (
                    <div key={remark.id}>
                        <Button
                            onClick={() => setRemarkState(remark.name)}
                            className={`rounded-none bg-white  hover:bg-white text-lg font-semibold px-4 py-2 transition-colors ${
                                remark.name === remarkState
                                    ? "text-primary"
                                    : "text-secondary"
                            }`}
                        >
                            {remark.name}
                        </Button>
                    </div>
                ))}
            </div>

            { remarkState && <RelatedProduct remark={remarkState} /> }

        </>
    );
};

export default RemarkTab;