import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/main/login/login.component';
import { AdminRoutingComponent } from './pages/main/admin-routing/admin-routing.component';
import { BillinglistComponent } from './pages/billing/billinglist/billinglist.component';
import { CampaignformComponent } from './pages/campaign/campaignform/campaignform.component';
import { CampaignlistemailComponent } from './pages/campaign/campaignlistemail/campaignlistemail.component';
import { CampaignlistnotifComponent } from './pages/campaign/campaignlistnotif/campaignlistnotif.component';
import { CampaignpreviewComponent } from './pages/campaign/campaignpreview/campaignpreview.component';
import { DashboardviewComponent } from './pages/dashboard/dashboardview/dashboardview.component';
import { DashboardinputsundayComponent } from './pages/dashboard/dashboardinputsunday/dashboardinputsunday.component';
import { DashboardcustomqueryComponent } from './pages/dashboard/dashboardcustomquery/dashboardcustomquery.component';
import { DashboardcustomquerydetailComponent } from './pages/dashboard/dashboardcustomquerydetail/dashboardcustomquerydetail.component';
import { DlapplicationlistComponent } from './pages/digitalform/dlapplicationlist/dlapplicationlist.component';
import { DlapplicationdetailComponent } from './pages/digitalform/dlapplicationdetail/dlapplicationdetail.component';
import { FilelistComponent } from './pages/file/filelist/filelist.component';
import { HomeComponent } from './pages/home/home.component';
import { MinistrylistComponent } from './pages/ministry/ministrylist/ministrylist.component';
import { MinistryformComponent } from './pages/ministry/ministryform/ministryform.component';
import { MinistrydetailComponent } from './pages/ministry/ministrydetail/ministrydetail.component';
import { NewsfeedlistComponent } from './pages/newsfeed/newsfeedlist/newsfeedlist.component';
import { NewsfeedformComponent } from './pages/newsfeed/newsfeedform/newsfeedform.component';
import { NgcheckinfamilylistComponent } from './pages/ngcheckin/ngcheckinfamilylist/ngcheckinfamilylist.component';
import { NgcheckinfamilydetailComponent } from './pages/ngcheckin/ngcheckinfamilydetail/ngcheckinfamilydetail.component';
import { NgcheckinfamilyformComponent } from './pages/ngcheckin/ngcheckinfamilyform/ngcheckinfamilyform.component';
import { PrayerlistComponent } from './pages/prayerpraise/prayerlist/prayerlist.component';
import { PraiselistComponent } from './pages/prayerpraise/praiselist/praiselist.component';
import { PrayerpraisehistoryComponent } from './pages/prayerpraise/prayerpraisehistory/prayerpraisehistory.component';
import { ProgramformComponent } from './pages/program/programform/programform.component';
import { ProgramlistComponent } from './pages/program/programlist/programlist.component';
import { ProgramdetailComponent } from './pages/program/programdetail/programdetail.component';
import { ProgramqrdetailComponent } from './pages/program/programdetail/programqrdetail/programqrdetail.component';
import { ProgramcodelistComponent } from './pages/program/programcodelist/programcodelist.component';
import { ProgramcodeformComponent } from './pages/program/programcodeform/programcodeform.component';
import { UserdetailComponent } from './pages/user/userdetail/userdetail.component';
import { UserlistroleComponent } from './pages/superadmin/userlistrole/userlistrole.component';
import { UserlistComponent } from './pages/user/userlist/userlist.component';
import { UserrolesummaryComponent } from './pages/user/userrolesummary/userrolesummary.component';
import { UserfamilyformComponent } from './pages/user/userfamilyform/userfamilyform.component';
import { UserfamilylistComponent } from './pages/user/userfamilylist/userfamilylist.component';
import { UserfamilydetailComponent } from './pages/user/userfamilydetail/userfamilydetail.component';
import { SmallgrouplistComponent } from './pages/smallgroup/smallgrouplist/smallgrouplist.component';
import { SmallgroupdetailComponent } from './pages/smallgroup/smallgroupdetail/smallgroupdetail.component';
import { SmallgroupformComponent } from './pages/smallgroup/smallgroupform/smallgroupform.component';
import { SmallgroupappointmentlistComponent } from './pages/smallgroup/smallgroupappointmentlist/smallgroupappointmentlist.component';
import { SmallgroupappointmentdetailComponent } from './pages/smallgroup/smallgroupappointmentdetail/smallgroupappointmentdetail.component';
import { SmallgrouptreeComponent } from './pages/smallgroup/smallgrouptree/smallgrouptree.component';
import { SmallgrouprequestComponent } from './pages/smallgroup/smallgrouprequest/smallgrouprequest.component';
import { SmallgroupotherexportComponent } from './pages/smallgroup/smallgroupotherexport/smallgroupotherexport.component';
import { SocketComponent } from './test/socket/socket.component';
import { SmallgroupdashboardComponent } from './pages/smallgroup/smallgroupdashboard/smallgroupdashboard.component';
import { UnregisteredfilesComponent } from './pages/superadmin/unregisteredfiles/unregisteredfiles.component';
import { TicketapprovalsComponent } from './pages/program/programdetail/ticketapprovals/ticketapprovals.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{
		path: 'admin', component: AdminRoutingComponent,
		children: [
			{ path: '', component: HomeComponent },
			{ path: 'billing/list', component: BillinglistComponent },
			{ path: 'campaign/form', component: CampaignformComponent },
			{ path: 'campaign/list-email', component: CampaignlistemailComponent },
			{ path: 'campaign/list-notif', component: CampaignlistnotifComponent },
			{ path: 'campaign/preview', component: CampaignpreviewComponent },
			{ path: 'dashboard', component: DashboardviewComponent },
			{ path: 'dashboard/input-sundayattendance', component: DashboardinputsundayComponent },
			{ path: 'dashboard/customquery', component: DashboardcustomqueryComponent },
			{ path: 'dashboard/customquery/detail', component: DashboardcustomquerydetailComponent },
			{ path: 'devotion/list', component: NewsfeedlistComponent },
			{ path: 'devotion/form', component: NewsfeedformComponent },
			{ path: 'digitalform/:applicationtype/list', component: DlapplicationlistComponent },
			{ path: 'digitalform/:applicationtype/detail', component: DlapplicationdetailComponent },
			{ path: 'file/list', component: FilelistComponent },
			{ path: ':filegroup/file', component: FilelistComponent },
			{ path: 'ministry/form', component: MinistryformComponent },
			{ path: 'ministry/edit', component: MinistryformComponent },
			{ path: 'ministry/list', component: MinistrylistComponent },
			{ path: 'ministry/detail', component: MinistrydetailComponent },
			{ path: 'newsfeed/list', component: NewsfeedlistComponent },
			{ path: 'newsfeed/form', component: NewsfeedformComponent },
			{ path: 'nextgen/family/list', component: NgcheckinfamilylistComponent },
			{ path: 'nextgen/family/detail', component: NgcheckinfamilydetailComponent },
			{ path: 'nextgen/family/form', component: NgcheckinfamilyformComponent },
			{ path: 'newsfeed/list', component: NewsfeedlistComponent },
			{ path: 'prayerpraise/list-prayer', component: PrayerlistComponent },
			{ path: 'prayerpraise/list-praise', component: PraiselistComponent },
			{ path: 'prayerpraise/user-history', component: PrayerpraisehistoryComponent },
			{ path: 'program/:type/detail', component: ProgramdetailComponent },
			{ path: 'program/:type/list', component: ProgramlistComponent },
			{ path: 'program/:type/form', component: ProgramformComponent },
			{ path: 'program/:type/form-code', component: ProgramcodeformComponent },
			{ path: 'program/:type/list-code', component: ProgramcodelistComponent },
			{ path: 'program/qr-detail', component: ProgramqrdetailComponent },
			{ path: 'program/ticketapprovals', component: TicketapprovalsComponent },
			{ path: 'smallgroup/list', component: SmallgrouplistComponent },
			{ path: 'smallgroup/dashboard', component: SmallgroupdashboardComponent },
			{ path: 'smallgroup/detail', component: SmallgroupdetailComponent },
			{ path: 'smallgroup/form', component: SmallgroupformComponent },
			{ path: 'smallgroup/list-appointments', component: SmallgroupappointmentlistComponent },
			{ path: 'smallgroup/detail-appointments', component: SmallgroupappointmentdetailComponent },
			{ path: 'smallgroup/tree', component: SmallgrouptreeComponent },
			{ path: 'smallgroup/request', component: SmallgrouprequestComponent },
			{ path: 'smallgroup/other-export', component: SmallgroupotherexportComponent },
			{ path: 'superadmin/list-role', component: UserlistroleComponent },
			{ path: 'superadmin/unregistered-files', component: UnregisteredfilesComponent },
			{ path: 'user/detail', component: UserdetailComponent },
			{ path: 'user/list', component: UserlistComponent },
			{ path: 'user/role-summary', component: UserrolesummaryComponent },
			{ path: 'user/family/form', component: UserfamilyformComponent },
			{ path: 'user/family/list', component: UserfamilylistComponent },
			{ path: 'user/family/detail', component: UserfamilydetailComponent },
		]
	},
	{ path: 'test/socket', component: SocketComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
