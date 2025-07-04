import React from "react";

interface FreeInstallContractContentProps {
    signUpData: {
        name: string;
        address: string;
    };
}

const FreeInstallContractContent: React.FC<FreeInstallContractContentProps> = ({
    signUpData,
}) => {
    return (
        <div className="prose prose-sm max-w-none">
            <h4 className="text-lg font-bold mb-4">
                Orangeburg Fiber Network Customer Agreement
            </h4>

            <p className="mb-4">
                This Customer Agreement (the &quot;Agreement&quot;) is entered into by and
                between Orangeburg Fiber Network (&quot;Orangeburg&quot;), located at [Insert
                Address], and the customer (&quot;Customer&quot;), whose information is
                provided below.
            </p>

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

            <h5 className="font-semibold mt-6 mb-2">1. Service Commitment</h5>
            <p className="mb-4">
                The Customer agrees to maintain an active subscription to Orangeburg Fiber
                services for a minimum period of six (6) months from the date of
                installation. Installation fees are waived under this option.
            </p>

            <h5 className="font-semibold mb-2">2. Service Terms</h5>
            <p className="mb-2">
                2.1 The Customer may switch internet service providers or cancel services at
                any time. This Agreement does not impose any long-term commitment beyond the
                six-month service period.
            </p>
            <p className="mb-2">
                2.2 Any changes to service must comply with Orangeburg's standard terms and
                conditions.
            </p>
            <p className="mb-4">
                2.3 If the Customer cancels services before the six-month period, a $350
                early termination fee will apply.
            </p>

            <h5 className="font-semibold mb-2">3. Installation and Equipment</h5>
            <p className="mb-2">
                3.1 Orangeburg will install the necessary equipment to provide fiber
                internet services at the Customer's premises. All equipment provided by
                Orangeburg remains the property of Orangeburg.
            </p>
            <p className="mb-2">
                3.2 The Customer is responsible for maintaining the provided equipment in
                good working condition. Any damage to equipment beyond normal wear and tear
                may result in repair or replacement charges.
            </p>
            <p className="mb-4">
                3.3 If the Customer terminates services, all Orangeburg equipment must be
                returned within 14 days. Failure to return the equipment may result in
                additional charges.
            </p>

            <h5 className="font-semibold mb-2">4. Billing and Payments</h5>
            <p className="mb-2">
                4.1 Service fees will be billed monthly. Payments are due in full on the
                billing date.
            </p>
            <p className="mb-2">
                4.2 The monthly service fees will remain consistent during the initial
                six-month period.
            </p>
            <p className="mb-4">
                4.3 Late payments may incur penalties as outlined in Orangeburg's standard
                billing terms.
            </p>

            <h5 className="font-semibold mb-2">5. Limitation of Liability</h5>
            <p className="mb-2">
                5.1 Orangeburg is not liable for any interruption of service, except as
                provided by applicable law. Customers must notify Orangeburg of any service
                issues to allow for resolution.
            </p>
            <p className="mb-4">
                5.2 This Agreement does not limit the Customer's right to choose another
                internet service provider at any time.
            </p>

            <h5 className="font-semibold mb-2">6. Entire Agreement</h5>
            <p className="mb-4">
                This Agreement constitutes the entire agreement between Orangeburg and the
                Customer concerning the subject matter hereof and supersedes any prior
                agreements or understandings.
            </p>
        </div>
    );
};

export default FreeInstallContractContent; 