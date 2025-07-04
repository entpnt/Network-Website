import React from "react";

interface PropertyAccessContractContentProps {
    signUpData: {
        name: string;
        address: string;
    };
}

const PropertyAccessContractContent: React.FC<PropertyAccessContractContentProps> = ({
    signUpData,
}) => {
    return (
        <div className="prose prose-sm max-w-none">
            <h4 className="text-lg font-bold mb-4">Property Access Agreement</h4>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800 mb-4">
                <h5 className="font-semibold mb-2">Customer Information:</h5>
                <p>
                    <strong>Name:</strong> {signUpData.name}
                </p>
                <p>
                    <strong>Address:</strong> {signUpData.address}
                </p>
                <p>
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
            </div>

            <h5 className="font-semibold mt-6 mb-2">1. Grant of Access</h5>
            <p className="mb-4">
                You grant Orangeburg Fiber non-exclusive access to your property to install,
                maintain, and operate fiber optic cables, electronic access portals, and
                associated equipment (&quot;Equipment&quot;). Access includes necessary
                ingress and egress for these activities. If requested in writing, Orangeburg
                Fiber will remove all Equipment within 30 days. Unremoved Equipment after
                this period may be considered abandoned. Orangeburg Fiber will restore your
                property to its original condition after installation or removal, excluding
                normal wear and tear.
            </p>

            <h5 className="font-semibold mb-2">2. Maintenance and Damage Responsibility</h5>
            <p className="mb-4">
                Orangeburg Fiber will repair any damage caused during installation or
                maintenance and restore affected areas to a reasonable condition. The Company
                is responsible for locating and avoiding utility damage. If the Owner damages
                Company Equipment, the Company may seek reimbursement for repairs, including
                legal fees.
            </p>

            <h5 className="font-semibold mb-2">3. Assignment of Rights</h5>
            <p className="mb-4">
                Either party may transfer their rights and obligations under this Agreement
                to a third party, with prior written notice to the other party.
            </p>

            <h5 className="font-semibold mb-2">4. Legal Compliance and Immunity</h5>
            <p className="mb-4">
                Orangeburg Fiber will comply with all applicable laws and retains any
                governmental immunity provided under state law.
            </p>

            <h5 className="font-semibold mb-2">5. Binding Effect</h5>
            <p className="mb-4">
                This Agreement is binding on all successors, assigns, heirs, executors, and
                administrators of both parties.
            </p>

            <h5 className="font-semibold mb-2">6. Limitation of Liability</h5>
            <p className="mb-4">
                Orangeburg Fiber's liability is limited to actual damages directly caused by
                gross negligence or intentional misconduct.
            </p>

            <h5 className="font-semibold mb-2">7. Amendments</h5>
            <p className="mb-4">
                Any changes to this Agreement must be in writing and signed by both parties.
            </p>

            <h5 className="font-semibold mb-2">8. Entire Agreement</h5>
            <p className="mb-4">
                This document is the full agreement between the Owner and the Company,
                superseding all prior communications.
            </p>
        </div>
    );
};

export default PropertyAccessContractContent; 