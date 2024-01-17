import { motion } from 'framer-motion';
import { Layout } from '@xfai-labs/ui-components';
import PageTitle from '@landing/components/PageTitle';

export default function Terms() {
  return (
    <motion.div
      key="termsOfUse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
      className="flex w-full grow flex-col items-center gap-12 self-stretch py-12 lg:gap-16 lg:py-16 2xl:gap-24 2xl:py-24"
    >
      <Layout.Container fluid className="">
        <Layout.Row className="justify-center">
          <Layout.Column className="w-full gap-2 lg:w-10/12 xl:w-8/12">
            <PageTitle
              title="XFit Token Terms And Conditions"
              description="Last Updated: April 2021"
              className="mb-8"
            />
            <p>
              These terms of use (“Terms of Use”) are entered into by and between You and XFai and
              its affiliates (“Company”, “we”, or “us”).
            </p>
            <p>
              PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS SITE. THESE TERMS OF USE
              REQUIRE THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN
              JURY TRIALS OR CLASS ACTIONS, AND ALSO LIMIT THE REMEDIES AVAILABLE TO YOU IN THE
              EVENT OF A DISPUTE.
            </p>
            <p>
              Acceptance of the Terms of Use By using the{' '}
              <a className="text-cyan underline" href="https://www.xfai.com/">
                www.xfai.com
              </a>{' '}
              website or any XFai applications/apps or application plug-ins (collectively, the
              “Website”), you accept and agree to follow and be bound by these Terms of Use and our
              annexed Privacy Notice, incorporated herein by reference, and also agree to comply
              with all applicable laws and regulations. If you do not want to agree to these Terms
              of Use or the Privacy Notice, you must not access or use the Website. The Company is
              not registered or licensed by any financial regulatory authority, is not your broker,
              lawyer, intermediary, agent, or advisor and has no fiduciary relationship or
              obligation to you regarding any other decisions or activities that you effect when
              using the Website. Neither our communications nor any information that we provide to
              you is intended as, or shall be considered or construed as, advice. We recommend you
              consult with a professional investment advisor before making any transaction or
              investment.
            </p>
            <p>
              Age Requirement You agree that by using the Website you are at least 18 years of age
              and you are legally able to enter into a contract. If you are not at least 18 years of
              age, you must not access or use the Website. Changes to the Terms of Use We may revise
              and update these Terms of Use from time to time in our sole discretion. All changes
              are effective immediately when we post them. Your continued use of the Website
              following the posting of revised Terms of Use means that you accept and agree to the
              changes.
            </p>
            <p>
              Accessing the Website and Account Security When connect a wallet to use or access
              certain portions of the Website, you must provide complete and accurate information as
              requested on any registration forms if provided. You may or may not be asked to
              provide a user name and password. You are entirely responsible for maintaining the
              confidentiality of your password if you are asked to provide one. You may not use a
              third party’s account, user name or password at any time. You agree to notify XFai
              immediately of any unauthorized use of your account, user name or password. XFai shall
              not be liable for any losses you incur as a result of someone else’s use of your
              account or password or access to your wallet, either with or without your knowledge.
              You may be held liable for any losses incurred by XFai, our affiliates, officers,
              directors, employees, consultants, agents and representatives due to someone else’s
              use of your account or password or wallet.
            </p>
            <p>
              You agree that all information you provide to register with the Website or otherwise,
              including but not limited to through the use of any interactive features on the
              Website, is governed by our Privacy Notice, and you consent to all actions we take
              with respect to your information consistent with our Privacy Notice.
            </p>
            <p>
              Intellectual Property Rights Any and all intellectual property rights (“Intellectual
              Property”) associated with the Website are the sole property of XFai, its affiliates
              or third parties. The Website’s content is protected by copyright and other laws. The
              Website may not be copied or imitated in whole or in part.
            </p>
            <p>
              All custom graphics, icons, and other items that appear on the Website are trademarks,
              service marks or trade dress (“Marks”) of XFai, its affiliates, or other entities that
              have granted XFai the right and license to use such Marks. The Marks may not be used
              or interfered with in any manner without our express written consent. Except as
              otherwise expressly authorized by these Terms of Use, you may not copy, reproduce,
              modify, lease, loan, sell, create derivative works from, upload, transmit, or
              distribute the Intellectual Property of the Website in any way without XFai’s or the
              appropriate third party’s prior written permission.
            </p>
            <p>
              Except as expressly provided herein, we do not grant to you any express or implied
              rights to XFai’s or any third party’s Intellectual Property. XFai grants You a
              limited, personal, nontransferable, nonsublicensable, revocable license to (a) access
              and use only the Website, Content and Services only in the manner presented by XFai,
              and (b) access and use the XFai computer and network services offered within the
              Website (the “XFai Systems”) only in the manner expressly permitted by XFai. Except
              for this limited license, XFai does not convey any interest in or to the XFai Systems,
              information or data available via the XFai Systems (the “Information”), Content,
              Services, Website or any other XFai property by permitting You to access the Website.
              Except to the extent required by law or as expressly provided herein, none of the
              Content and/or Information may be reverse-engineered, modified, reproduced,
              republished, translated into any language or computer language, re-transmitted in any
              form or by any means, resold or redistributed without the prior written consent of
              XFai.
            </p>
            <p>
              You may not make, sell, offer for sale, modify, reproduce, display, publicly perform,
              import, distribute, retransmit or otherwise use the Content in any way, unless
              expressly permitted to do so by XFai.
            </p>
            <p>
              Prohibited Uses You may not use any “deep-link”, “page-scrape”, “robot”, “spider” or
              other automatic device, program, algorithm or methodology, or any similar or
              equivalent manual process, to access, acquire, copy or monitor any portion of the
              Website, or in any way reproduce or circumvent the navigational structure or
              presentation of the Website or any Content, to obtain or attempt to obtain any
              materials, documents or information through any means not purposely made available
              through the Website. XFai reserves the right to bar any such activity.
            </p>
            <p>
              You may not attempt to gain unauthorized access to any portion or feature of the
              Website, or any other systems or networks connected to the Website or to any XFai
              server, or to any of the services offered on or through the Website, by hacking,
              password “mining” or any other illegitimate means.
            </p>
            <p>
              You may not probe, scan or test the vulnerability of the Website or any network
              connected to the Website, nor breach the security or authentication measures on the
              Website or any network connected to the Website. You may not reverse look-up, trace or
              seek to trace any information on any other user of or visitor to the Website, or any
              other customer of XFai, including any XFai account not owned by you, to its source, or
              exploit the Website or any service or information made available or offered by or
              through the Website, in any way where the purpose is to reveal any information,
              including but not limited to personal identification or information, other than your
              own information, as provided for by the Website.
            </p>
            <p>
              You agree that you will not take any action that imposes an unreasonable or
              disproportionately large load on the infrastructure of the Website or XFai’s systems
              or networks, or any systems or networks connected to the Website or to XFai.
            </p>
            <p>
              You agree not to use any device, software or routine to interfere or attempt to
              interfere with the proper working of the Website or any transaction being conducted on
              the Website, or with any other person’s use of the Website.
            </p>
            <p>
              You may not forge headers or otherwise manipulate identifiers in order to disguise the
              origin of any message or transmittal you send to XFai on or through the Website or any
              service offered on or through the Website. You may not pretend that you are, or that
              you represent, someone else, or impersonate any other individual or entity.
            </p>
            <p>
              You may not use the Website or any Content for any purpose that is unlawful or
              prohibited by these Terms of Use, or to solicit the performance of any illegal
              activity or other activity which infringes the rights of XFai or others.
            </p>
            <p>
              User Contributions The Website may contain message boards, chat rooms, personal web
              pages or profiles, forums, bulletin boards, and other interactive features
              (collectively, “Interactive Services”) that allow users to post, submit, publish,
              display, or transmit to other users or other persons (hereinafter, “post”) content or
              materials (collectively, “User Contributions”) on or through the Website.
            </p>
            <p>
              All User Contributions must comply with the Content Standards set out in these Terms
              of Use.
            </p>
            <p>
              Any User Contribution you post to the Website will be considered non-confidential and
              non-proprietary. By providing any User Contribution on the Website, you grant us and
              our affiliates and service providers, and each of their and our respective licensees,
              successors, and assigns the right to use, reproduce, modify, perform, display,
              distribute, and otherwise disclose to third parties any such material for any
              purpose/according to your account settings.
            </p>
            <p>
              You represent and warrant that (i) You own or control all rights in and to the User
              Contributions and have the right to grant the license granted above to us and our
              affiliates and service providers, and each of their and our respective licensees,
              successors, and assigns; and (ii) all of your User Contributions do and will comply
              with these Terms of Use.
            </p>
            <p>
              You understand and acknowledge that you are responsible for any User Contributions you
              submit or contribute, and you, not the Company, have full responsibility for such
              content, including its legality, reliability, accuracy, and appropriateness. We are
              not responsible or liable to any third party for the content or accuracy of any User
              Contributions posted by you or any other user of the Website.
            </p>
            <p>Monitoring and Enforcement; Termination</p>
            <p>
              We have the right to (i) remove or refuse to post any User Contributions for any or no
              reason in our sole discretion; (ii) take any action with respect to any User
              Contribution that we deem necessary or appropriate in our sole discretion, including
              if we believe that such User Contribution violates the Terms of Use, including the
              Content Standards, infringes any intellectual property right or other right of any
              person or entity, threatens the personal safety of users of the Website or the public,
              or could create liability for the Company; (iii) disclose your identity or other
              information about you to any third party who claims that material posted by you
              violates their rights, including their intellectual property rights or their right to
              privacy; (iv) Take appropriate legal action, including without limitation, referral to
              law enforcement, for any illegal or unauthorized use of the Website; and (v) terminate
              or suspend your access to all or part of the Website for any or no reason, including
              without limitation, any violation of these Terms of Use. Without limiting the
              foregoing, we have the right to cooperate fully with any law enforcement authorities
              or court order requesting or directing us to disclose the identity or other
              information of anyone posting any materials on or through the Website.
            </p>
            <p>
              YOU WAIVE AND HOLD HARMLESS THE COMPANY AND ITS AFFILIATES, LICENSEES, AND SERVICE
              PROVIDERS FROM ANY CLAIMS RESULTING FROM ANY ACTION TAKEN BY ANY OF THE FOREGOING
              PARTIES DURING, OR TAKEN AS A CONSEQUENCE OF, INVESTIGATIONS BY EITHER SUCH PARTIES OR
              LAW ENFORCEMENT AUTHORITIES. However, we do not undertake to review material before it
              is posted on the Website, and cannot ensure prompt removal of objectionable material
              after it has been posted. Accordingly, we assume no liability for any action or
              inaction regarding transmissions, communications, or content provided by any user or
              third party. We have no liability or responsibility to anyone for performance or
              nonperformance of the activities described in this section.
            </p>
            <p>
              Content Standards These content standards apply to any and all User Contributions and
              use of Interactive Services. User Contributions must in their entirety comply with all
              applicable federal, state, local, and international laws and regulations. Without
              limiting the foregoing, User Contributions must not (i) contain any material that is
              defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful,
              inflammatory, or otherwise objectionable; (ii) promote sexually explicit or
              pornographic material, violence, or discrimination based on race, sex, religion,
              nationality, disability, sexual orientation, or age; (iii) infringe any patent,
              trademark, trade secret, copyright, or other intellectual property or other rights of
              any other person; (iv) violate the legal rights (including the rights of publicity and
              privacy) of others or contain any material that could give rise to any civil or
              criminal liability under applicable laws or regulations or that otherwise may be in
              conflict with these Terms of Use and our Privacy Notice; (v) be likely to deceive any
              person; (vi) promote any illegal activity, or advocate, promote, or assist any
              unlawful act; (vii) cause annoyance, inconvenience, or needless anxiety or be likely
              to upset, embarrass, alarm, or annoy any other person; (viii) impersonate any person,
              or misrepresent your identity or affiliation with any person or organization; (ix)
              involve commercial activities or sales, such as contests, sweepstakes, and other sales
              promotions, barter, or advertising; or (x) give the impression that they emanate from
              or are endorsed by us or any other person or entity, if this is not the case.
            </p>
            <p>
              Changes to the Website Any aspect of the Website may be changed, supplemented, deleted
              or updated without notice at our sole discretion. We will not be liable if for any
              reason all or any part of the Website is unavailable at any time or for any period.
              From time to time, we may restrict access to some parts of the Website, or the entire
              Website, to users, including registered users.
            </p>
            <p>Information About You and Your Visits to the Website</p>
            <p>
              All information we collect on the Website is subject to our Privacy Notice. By using
              the Website, you consent to all actions taken by us with respect to your information
              in compliance with the Privacy Notice.
            </p>
            <p>
              Links Outbound Links. The Website may contain links to third-party Websites and
              resources (collectively, “Linked Sites”). These Linked Sites are provided solely as a
              convenience to You and not as an endorsement by XFai of the content on such Linked
              Sites. We make no representations or warranties regarding the correctness, accuracy,
              performance or quality of any content, software, service or application found at any
              Linked Site. We are not responsible for the availability of the Linked Sites or the
              content or activities of such sites. If you decide to access Linked Sites, you do so
              at your own risk. In addition, your use of Linked Sites is subject to any applicable
              policies and terms and conditions of use, including but not limited to, the Linked
              Site’s Privacy Notice.
            </p>
            <p>
              Inbound Links. Linking to any page of the Website other than to https://www.xfai.com
              through a plain text link is strictly prohibited in the absence of a separate linking
              agreement with XFai. Any website or other device that links to https://www.xfai.com or
              any page available therein is prohibited from (a) replicating Content, (b) using a
              browser or border environment around the Content, (c) implying in any fashion that
              XFai or any of its affiliates are endorsing it or its products, (d) misrepresenting
              any state of facts, including its relationship with XFai or any of its affiliates, (e)
              presenting false information about XFai products or services, and (f) using any logo
              or mark of XFai or any of its affiliates without our express written permission.
            </p>
            <p>
              Disclaimers You understand that we cannot and do not guarantee or warrant that files
              available for downloading from the internet or the Website will be free of viruses or
              other destructive code. You are responsible for implementing sufficient procedures and
              checkpoints to satisfy your particular requirements for anti-virus protection and
              accuracy of data input and output, and for maintaining a means external to our site
              for any reconstruction of any lost data.
            </p>
            <p>
              WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE
              ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY INFECT YOUR
              COMPUTER EQUIPMENT, COMPUTER PROGRAMS, DATA OR OTHER PROPRIETARY MATERIAL DUE TO YOUR
              USE OF THE WEBSITE OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE OR TO YOUR
              DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
            </p>
            <p>
              YOUR USE OF THE WEBSITE, ITS CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE
              WEBSITE IS AT YOUR OWN RISK.
            </p>
            <p>
              THE WEBSITE, ITS CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE ARE
              PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT ANY WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED.
            </p>
            <p>
              NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR
              REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY,
              ACCURACY OR AVAILABILITY OF THE WEBSITE.
            </p>
            <p>
              WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE
              COMPANY REPRESENTS OR WARRANTS THAT THE WEBSITE, ITS CONTENT OR ANY SERVICES OR ITEMS
              OBTAINED THROUGH THE WEBSITE WILL BE ACCURATE, RELIABLE, ERROR-FREE OR UNINTERRUPTED,
              THAT DEFECTS WILL BE CORRECTED, THAT OUR SITE OR THE SERVER THAT MAKES IT AVAILABLE
              ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE WEBSITE OR ANY SERVICES OR
              ITEMS OBTAINED THROUGH THE WEBSITE WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
            </p>
            <p>
              THE COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
              STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
              MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR PARTICULAR PURPOSE. THE FOREGOING
              DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE
              LAW.
            </p>
            <p>
              Limitation on Liability IN NO EVENT WILL THE COMPANY, ITS AFFILIATES OR THEIR
              LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS BE LIABLE FOR
              DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR
              USE, OR INABILITY TO USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE
              WEBSITE OR SUCH OTHER WEBSITES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE
              OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
              CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN
              AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS
              OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER
              CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT OR OTHERWISE, EVEN IF
              FORESEEABLE. THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR
              LIMITED UNDER APPLICABLE LAW.
            </p>
            <p>
              Your Assumption of Risk Use of the Website and participation in transactions through
              the Website may carry financial risk. You acknowledge and agree that you are aware of
              and accept such risks, including the following: Trading crypto assets can be very
              risky. Crypto assets are, by their nature, highly experimental, risky, volatile and
              transactions are generally irreversible. All transactions are final and there are no
              refunds. You acknowledge and agree that you will access and use the Website and
              participate in transactions at your own risk. The risk of loss in trading crypto
              assets can be substantial. You should, therefore, carefully consider whether such
              trading is suitable for you in light of your circumstances and financial resources.
            </p>
            <p>
              Understanding crypto assets and transactions may require advanced technical knowledge.
              Crypto assets are often described in exceedingly technical language that requires a
              comprehensive understanding of applied cryptography and computer science in order to
              appreciate the inherent risks of trading crypto assets. Any reference to a type of
              crypto asset on the Website does not indicate our approval or disapproval of the
              underlying technology regarding such type of crypto asset and should not be used as a
              substitute for your own understanding of the risks specific to each type of crypto
              asset. We make no warranty as to the suitability of the crypto assets referenced on
              the Website and assume no fiduciary duty in our relations with you. You represent and
              warrant that you have the necessary technical expertise and ability to review and
              evaluate the security, integrity and operation of any transactions and know,
              understand and accept the risks associated therewith; and You accept the risk of
              trading crypto assets. The Company does not advise on trading risk. In entering into
              any transaction, you represent that you have been, are and will be solely responsible
              for making your own independent appraisal and investigations into the risks of the
              transaction and the underlying crypto assets. You represent that you have sufficient
              knowledge, market sophistication, professional advice and experience to make your own
              evaluation of the merits and risks of any transaction or any underlying crypto asset,
              including the risk that you may lose access to your crypto assets indefinitely. All
              transaction decisions are made solely by you. Notwithstanding anything in these Terms
              of Use, we accept no responsibility whatsoever for and will in no circumstances be
              liable to you in connection with transactions. Under no circumstances will the
              operation of all or any portion of the Website be deemed to create a relationship that
              includes the provision or tendering of investment advice.
            </p>
            <p>
              You are responsible for complying with applicable law. You agree that we are not
              responsible for determining whether or which laws may apply to your transactions,
              including tax laws. You are solely responsible for reporting and paying any taxes
              arising from your use of the Website and participation in any transaction. You are
              aware of and accept the risk of operational challenges. The Website may experience
              sophisticated cyberattacks, unexpected surges in activity or other operational or
              technical difficulties that may cause interruptions to or delays on the Website. You
              agree to accept the risk of a transaction failure resulting from unanticipated or
              heightened technical difficulties, including those resulting from sophisticated
              attacks, and you agree not to hold us or our affiliates accountable for any related
              losses. We will not bear any liability, whatsoever, for any damage or interruptions
              caused by any viruses that may affect your computer or other equipment, or any
              phishing, spoofing or other attack. We advise the regular use of a reputable and
              readily available virus screening and prevention software.
            </p>
            <p>
              The Company must comply with applicable law. We comply with all legal requests for
              information, and reserve the right to provide information, including transaction
              Information, to law enforcement personnel and other third parties to answer inquiries,
              to respond to legal process, to respond to the order of a court of competent
              jurisdiction and those exercising the court’s authority and to protect the Company and
              our users.
            </p>
            <p>
              You hereby assume and agree that the Company will have no responsibility or liability
              for, such risks. You hereby irrevocably waive, release and discharge all claims,
              whether known or unknown to you, against the Company, its affiliates and their
              respective shareholders, members, directors, officers, employees, agents and
              representatives related to any of the risks set forth herein.
            </p>
            <p>
              Indemnification You agree, to the maximum extent permitted by law, at your own
              expense, to indemnify, defend, and hold harmless XFai, together with its officers,
              directors, employees, agents, representatives, partners, licensors, suppliers,
              stockholders, contractors, partners and agents, from and against all claims, suits,
              proceedings, disputes, demands, liabilities, damages, losses, costs and expenses,
              including, without limitation, reasonable attorneys’, expert, and accounting fees, in
              any way related to (i) your access to or use of the Website (including negligent or
              wrongful conduct) or of any other person accessing the Website using your account or
              (ii) your breach of any of these Terms of Use or of any other person accessing the
              Website using your account.
            </p>
            <p>
              You agree to pay any and all costs, damages, and expenses, including, but not limited
              to, reasonable attorneys’ fees and costs awarded against or otherwise incurred by or
              in connection with or arising from any such claim, suit, action, or proceeding
              attributable to any such claim. XFai reserves the right, at its own expense, to assume
              the exclusive defense and control of any matter otherwise subject to indemnification
              by you, in which event you will fully cooperate with XFai in asserting any available
              defense. You acknowledge and agree to pay XFai’s reasonable attorneys’ fees incurred
              in connection with any and all lawsuits brought against you by XFai under these Terms
              of Use and any other terms and conditions of service on the Website, including without
              limitation, lawsuits arising from your failure to indemnify XFai pursuant to these
              Terms of Use.
            </p>
            <p>
              Governing Law and Dispute Resolution This Agreement shall be governed by and construed
              in accordance with the laws of the Cayman Islands without regard to its conflict of
              laws or choice of law rules. The parties shall use their best efforts to engage
              directly to settle any dispute, claim, question, or disagreement and engage in good
              faith negotiations which shall be a condition to either party initiating a lawsuit or
              arbitration. You agree that you will notify each other of any dispute within thirty
              (30) days of when it arises, that you will attempt informal resolution prior to any
              demand for arbitration.
            </p>
            <p>
              If the parties do not reach an agreed upon solution within a period of 30 days from
              the time informal dispute resolution under the Initial Dispute Resolution provision
              begins, then either party may initiate arbitration as the sole means to resolve
              claims, subject to the terms set forth below. Specifically, all claims arising out of
              or relating to these Terms of Use (including their formation, performance and breach),
              the parties’ relationship with each other and/or your use of the Service shall be
              finally settled according to the laws of Cayman Islands, excluding any rules or
              procedures governing or permitting class actions. The arbitrator, and not any federal,
              state or local court or agency, shall have exclusive authority to resolve all disputes
              arising out of or relating to the interpretation, applicability, enforceability or
              formation of these Terms of Use, including, but not limited to any claim that all or
              any part of these Terms of Use are void or voidable, or whether a claim is subject to
              arbitration. The arbitrator shall be empowered to grant whatever relief would be
              available in a court under law or in equity. The arbitrator’s award shall be written,
              and binding on the parties and may be entered as a judgment in any court of competent
              jurisdiction. The parties understand that, absent this mandatory provision, they would
              have the right to sue in court and have a jury trial. They further understand that, in
              some instances, the costs of arbitration could exceed the costs of litigation and the
              right to discovery may be more limited in arbitration than in court.
            </p>
            <p>
              The parties further agree that any arbitration shall be conducted in their individual
              capacities only and not as a class action or other representative action, and the
              parties expressly waive their right to file a class action or seek relief on a class
              basis. You and the Company agree that each may bring claims against the other only in
              your or its individual capacity, and not as a plaintiff or class member in any
              purported class or representative proceeding. If any court or arbitrator determines
              that the class action waiver set forth in this paragraph is void or unenforceable for
              any reason or that an arbitration can proceed on a class basis, then the arbitration
              provision set forth above shall be deemed null and void in its entirety and the
              parties shall be deemed to have not agreed to arbitrate disputes.
            </p>
            <p>
              If the arbitration provision of Section 17 is held by a court or other tribunal of
              competent jurisdiction to be invalid, illegal, or unenforceable for any reason, You
              and XFai agree to the exclusive jurisdiction of the Courts of the Cayman Islands to
              resolve any dispute, claim, or controversy that relates to or arises in connection
              with the Agreements (and any non-contractual disputes/claims relating to or arising in
              connection with them) and is not subject to mandatory arbitration under this Section
              17.
            </p>
            <p>
              ANY PERMITTED CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO
              THESE TERMS OF USE OR THE WEBSITE MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE
              CAUSE OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS PERMANENTLY
              BARRED.
            </p>
            <p>
              Waiver and Severability No waiver by the Company of any term or condition set out in
              these Terms of Use shall be deemed a further or continuing waiver of such term or
              condition or a waiver of any other term or condition, and any failure of the Company
              to assert a right or provision under these Terms of Use shall not constitute a waiver
              of such right or provision. If any provision of these Terms of Use is held by a court
              or other tribunal of competent jurisdiction to be invalid, illegal, or unenforceable
              for any reason, such provision shall be eliminated or limited to the minimum extent
              such that the remaining provisions of these Terms of Use will continue in full force
              and effect.
            </p>
            <p>
              Rights of Third Parties For the purposes of the Contracts (Rights of Third Parties)
              Act (Revised) of the Cayman Islands each indemnified and/or released person is an
              intended third-party beneficiary under these Terms of Use. However, the Company may
              rescind or vary this these Terms of Use (including any variation so as to extinguish
              or alter a third party&apos;s entitlement to enforce any provisions of these Terms of
              Use) without the consent of any such third party.
            </p>
            <p>
              Entire Agreement The Terms of Use and our Privacy Notice constitute the sole and
              entire agreement between you and XFai regarding the Website and supersede all prior
              and contemporaneous understandings, agreements, representations, and warranties, both
              written and oral, regarding the Website.
            </p>
            <p>
              CAYMAN PRIVACY NOTICE This privacy notice (the “Cayman Privacy Notice”) explains the
              manner in which Palisades and its Affiliates (the “XFai Group”) collects, processes
              and maintains personal data about you pursuant to the Data Protection Act (Revised) of
              the Cayman Islands, as amended from time to time, and any regulations or orders
              promulgated pursuant thereto (the “DPA”). The XFai Group is committed to processing
              personal data in accordance with the DPA. In its use of personal data, certain members
              of the XFai Group will be characterized under the DPA as a “data controller”, whilst
              certain of the XFai Group’s service providers, affiliates and delegates may act as
              “data processors” under the DPA. For the purposes of this Cayman Privacy Notice, we,
              us or our means each member of the XFai Group in its capacity (as relevant) as data
              controller of the personal data and you or your means the Tokenholder or relevant
              individual affiliated or connected with the Tokenholder receiving this Cayman Privacy
              Notice. If you are a nominee Tokenholder or a corporate entity, this Cayman Privacy
              Notice will be relevant for those individuals connected to you and you should transmit
              this document to such individuals for their awareness and consideration. Personal
              data: By virtue of acquiring Tokens, the XFai Group and certain other service
              providers and their respective affiliates and delegates (the “Authorized Entities”)
              may collect, record, store, transfer and otherwise process personal data by which
              individuals may be directly or indirectly identified. We may combine personal data
              that you provide to us with personal data that we collect from or about you. This may
              include personal data collected in an online or offline context including from credit
              reference agencies and other available public databases or data sources, such as news
              outlets, websites and other media sources and international sanctions lists. It may
              also include data which, when aggregated with other data, enables an individual to be
              identified, such as an IP address and geolocation data. Why is your personal data
              processed: The storage, processing and use of personal data by the XFai Group will
              take place for lawful purposes, including: to comply with any applicable legal, tax or
              regulatory obligations on the XFai Group or another Authorized Entity under any
              applicable laws and regulations; to perform a contract to which you are a party or for
              taking pre-contractual steps at your request; to operate the XFai Group, including
              managing and administering the Tokens and the business of the XFai Group on an
              on-going basis which enables the XFai Group and its Tokenholders to satisfy their
              contractual duties and obligations to each other; to verify the identity of the XFai
              Group to third parties for any purpose which the XFai Group considers necessary or
              desirable; to assist the XFai Group in the improvement and optimization of advertising
              (including through marketing material and content) its services; for risk management
              and risk control purposes relating to the XFai Group; to pursue the XFai Group’s or a
              third party’s legitimate interests: (i) for direct marketing purposes; or (ii) to help
              detect, prevent, investigate, and prosecute fraud and/or other criminal activity, and
              share this data with legal, compliance, risk and managerial staff to assess suspicious
              activities; and/or where you otherwise consent to the processing of personal data for
              any other specific purpose. As a data controller, we will only use your personal data
              for the purposes for which we collected it as set out in this Cayman Privacy Notice.
              If we need to use your personal data for an unrelated purpose, we will contact you. In
              certain circumstances, we may share your personal data with regulatory, prosecuting
              and other governmental agencies or departments, and parties to litigation (whether
              pending or threatened), in any country or territory. We may transfer your personal
              data outside of the Cayman Islands, as permitted under the DPA. We will not sell your
              personal data. Your rights: You have certain rights under the DPA, including: the
              right to be informed as to how we collect and use your personal data; the right to
              access your personal data; the right to require us to stop direct marketing; the right
              to have inaccurate or incomplete personal data corrected; the right to withdraw your
              consent and require us to stop processing or restrict the processing, or not begin the
              processing, of your personal data; the right to be notified of a data breach (unless
              the breach is unlikely to be prejudicial); the right to complain to the Data
              Protection Ombudsman of the Cayman Islands. You can access their website here:
              ombudsman.ky; and the right to require us to delete your personal data in some limited
              circumstances. Please note that if you do not wish to provide us with requested
              personal data or subsequently withdraw your consent, you may not be able to hold or
              otherwise deal with the Tokens or remain as a holder of the Tokens as it will affect
              our ability to provide our services to you as a Tokenholder. Retention of Personal
              Data: The personal data shall not be held by the XFai Group for longer than necessary
              with regard to the purposes of the data processing. Changes to Privacy Notice: We
              encourage you to regularly review this and any updated Cayman Privacy Notice to ensure
              that you are always aware of how personal data is collected, used, stored and
              disclosed. Contact Us: Please contact the XFai Group if you have any questions about
              this Cayman Privacy Notice, the personal data we hold about you or to discuss your
              rights under the DPA.
            </p>
          </Layout.Column>
        </Layout.Row>
      </Layout.Container>
    </motion.div>
  );
}
