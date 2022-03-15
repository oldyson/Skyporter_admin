import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';


import { SimplemdeModule } from 'ngx-simplemde';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { LoginComponent } from './pages/main/login/login.component';
import { ForgotpasswordComponent } from './pages/main/forgotpassword/forgotpassword.component';
import { DashboardviewComponent } from './pages/dashboard/dashboardview/dashboardview.component';
import { AdminRoutingComponent } from './pages/main/admin-routing/admin-routing.component';
import { CampaignlistemailComponent } from './pages/campaign/campaignlistemail/campaignlistemail.component';
import { CampaignlistnotifComponent } from './pages/campaign/campaignlistnotif/campaignlistnotif.component';

import { ExportfilterComponent } from './components/exportfilter/exportfilter.component';
import { ListtableComponent } from './components/listtable/listtable.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UserlistComponent } from './pages/user/userlist/userlist.component';
import { CampaignpreviewComponent } from './pages/campaign/campaignpreview/campaignpreview.component';
import { CampaignformComponent } from './pages/campaign/campaignform/campaignform.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { RecipientsComponent } from './pages/campaign/campaignform/recipients/recipients.component';
import { PreviewComponent } from './pages/campaign/campaignform/preview/preview.component';
import { NewsfeedlistComponent } from './pages/newsfeed/newsfeedlist/newsfeedlist.component';
import { NewsfeedformComponent } from './pages/newsfeed/newsfeedform/newsfeedform.component';
import { PrayerlistComponent } from './pages/prayerpraise/prayerlist/prayerlist.component';
import { PraiselistComponent } from './pages/prayerpraise/praiselist/praiselist.component';
import { UserrolesummaryComponent } from './pages/user/userrolesummary/userrolesummary.component';
import { PercenttoggleComponent } from './components/percenttoggle/percenttoggle.component';
import { LoadingSkyporterDirective } from './directives/loading-skyporter.directive';
import { PopupModalComponent } from './components/popup-modal/popup-modal.component';
import { PrayerpraisehistoryComponent } from './pages/prayerpraise/prayerpraisehistory/prayerpraisehistory.component';
import { InputformComponent } from './components/inputform/inputform.component';
import { MinistrylistComponent } from './pages/ministry/ministrylist/ministrylist.component';
import { MinistryformComponent } from './pages/ministry/ministryform/ministryform.component';
import { ProgramformComponent } from './pages/program/programform/programform.component';
import { BreakoutComponent } from './pages/program/programform/breakout/breakout.component';
import { PriceComponent } from './pages/program/programform/price/price.component';
import { ProgramcodeformComponent } from './pages/program/programcodeform/programcodeform.component';
import { UserfamilylistComponent } from './pages/user/userfamilylist/userfamilylist.component';
import { UserfamilyformComponent } from './pages/user/userfamilyform/userfamilyform.component';
import { UserfamilydetailComponent } from './pages/user/userfamilydetail/userfamilydetail.component';
import { UserdetailComponent } from './pages/user/userdetail/userdetail.component';
import { UserformComponent } from './pages/user/userform/userform.component';
import { UserrolelistComponent } from './pages/user/userrolelist/userrolelist.component';
import { NgcheckinfamilylistComponent } from './pages/ngcheckin/ngcheckinfamilylist/ngcheckinfamilylist.component';
import { NgcheckinfamilydetailComponent } from './pages/ngcheckin/ngcheckinfamilydetail/ngcheckinfamilydetail.component';
import { DateComponent } from './pages/program/programform/breakout/date/date.component';
import { ClassregistrantComponent } from './pages/class/classregistrant/classregistrant.component';
import { SafePipe } from './pipes/safe.pipe';
import { ProgramlistComponent } from './pages/program/programlist/programlist.component';
import { NgcheckinfamilyformComponent } from './pages/ngcheckin/ngcheckinfamilyform/ngcheckinfamilyform.component';
import { SgrolesComponent } from './pages/program/programcodeform/sgroles/sgroles.component';
import { ProgramcodelistComponent } from './pages/program/programcodelist/programcodelist.component';
import { Safebase64Pipe } from './pipes/safebase64.pipe';
import { ProgramdetailComponent } from './pages/program/programdetail/programdetail.component';
import { DetailtableComponent } from './pages/program/programdetail/detailtable/detailtable.component';
import { ListattendancetableComponent } from './components/listattendancetable/listattendancetable.component';
import { ListqrcodecheckinComponent } from './components/listqrcodecheckin/listqrcodecheckin.component';
import { SearchtableComponent } from './components/searchtable/searchtable.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { SmallgroupappointmentlistComponent } from './pages/smallgroup/smallgroupappointmentlist/smallgroupappointmentlist.component';
import { DashboardinputsundayComponent } from './pages/dashboard/dashboardinputsunday/dashboardinputsunday.component';
import { SundaytableComponent } from './pages/dashboard/dashboardinputsunday/sundaytable/sundaytable.component';
import { SmallgroupappointmentdetailComponent } from './pages/smallgroup/smallgroupappointmentdetail/smallgroupappointmentdetail.component';
import { SmallgrouplistComponent } from './pages/smallgroup/smallgrouplist/smallgrouplist.component';
import { SmallgroupdetailComponent } from './pages/smallgroup/smallgroupdetail/smallgroupdetail.component';
import { SmallgroupformComponent } from './pages/smallgroup/smallgroupform/smallgroupform.component';
import { TransfermemberComponent } from './pages/smallgroup/smallgroupdetail/transfermember/transfermember.component';
import { MinistrydetailComponent } from './pages/ministry/ministrydetail/ministrydetail.component';
import { InvitevolunteerComponent } from './components/invitevolunteer/invitevolunteer.component';
import { DlapplicationlistComponent } from './pages/digitalform/dlapplicationlist/dlapplicationlist.component';
import { DlapplicationdetailComponent } from './pages/digitalform/dlapplicationdetail/dlapplicationdetail.component';
import { FormComponent } from './pages/digitalform/dlapplicationdetail/form/form.component';
import { SocketComponent } from './test/socket/socket.component';
import { SmallgrouptreeComponent } from './pages/smallgroup/smallgrouptree/smallgrouptree.component';
import { WeekpickerComponent } from './components/weekpicker/weekpicker.component';
import { ChangeroleComponent } from './components/changerole/changerole.component';
import { UserlistroleComponent } from './pages/superadmin/userlistrole/userlistrole.component';
import { UserlistroletableComponent } from './components/userlistroletable/userlistroletable.component';
import { ListroleaddmodalComponent } from './pages/superadmin/userlistrole/listroleaddmodal/listroleaddmodal.component';
import { SmallgroupotherexportComponent } from './pages/smallgroup/smallgroupotherexport/smallgroupotherexport.component';
import { UserdetailinfoComponent } from './pages/user/userdetail/userdetailinfo/userdetailinfo.component';
import { UserdetailprogramComponent } from './pages/user/userdetail/userdetailprogram/userdetailprogram.component';
import { UserdetailjourneyComponent } from './pages/user/userdetail/userdetailjourney/userdetailjourney.component';
import { UserprogramhistoryComponent } from './pages/user/userdetail/userdetailprogram/userprogramhistory/userprogramhistory.component';
import { ProgramdiagrampopupComponent } from './components/programdiagrampopup/programdiagrampopup.component';
import { LinechartComponent } from './components/chart/linechart/linechart.component';
import { DashboardattendanceComponent } from './pages/dashboard/dashboardview/dashboardattendance/dashboardattendance.component';
import { DashboardusageComponent } from './pages/dashboard/dashboardview/dashboardusage/dashboardusage.component';
import { SmallgrouprequestComponent } from './pages/smallgroup/smallgrouprequest/smallgrouprequest.component';
import { TablefilelistComponent } from './pages/program/programdetail/detailtable/filelist/filelist.component';
import { AddprogramhistoryComponent } from './pages/user/userdetail/userdetailprogram/addprogramhistory/addprogramhistory.component';
import { SmallgroupdashboardComponent } from './pages/smallgroup/smallgroupdashboard/smallgroupdashboard.component';
import { SganomalycountComponent } from './pages/smallgroup/smallgroupdashboard/sganomalycount/sganomalycount.component';
import { ProgramqrdetailComponent } from './pages/program/programdetail/programqrdetail/programqrdetail.component';
import { SgreqanomalylistComponent } from './pages/smallgroup/smallgroupdashboard/sgreqanomalylist/sgreqanomalylist.component';
import { DashboardcustomqueryComponent } from './pages/dashboard/dashboardcustomquery/dashboardcustomquery.component';
import { DashboardcustomquerydetailComponent } from './pages/dashboard/dashboardcustomquerydetail/dashboardcustomquerydetail.component';
import { UseractiontableComponent } from './pages/user/userdetail/userdetailjourney/useractiontable/useractiontable.component';
import { FilelistComponent } from './pages/file/filelist/filelist.component';
import { ListfiletableComponent } from './components/listfiletable/listfiletable.component';
import { InputmodalComponent } from './components/inputmodal/inputmodal.component';
import { FileInputDirective } from './directives/file-input.directive';
import { UnregisteredfilesComponent } from './pages/superadmin/unregisteredfiles/unregisteredfiles.component';
import { BillinglistComponent } from './pages/billing/billinglist/billinglist.component';
import { SggrowthchartComponent } from './pages/smallgroup/smallgroupdashboard/sggrowthchart/sggrowthchart.component';
import { PiechartComponent } from './components/chart/piechart/piechart.component';
import { SgdemographicComponent } from './pages/smallgroup/smallgroupdashboard/sgdemographic/sgdemographic.component';
import { SgdiscipleshipjourneyComponent } from './pages/smallgroup/smallgroupdashboard/sgdiscipleshipjourney/sgdiscipleshipjourney.component';
import { BarchartComponent } from './components/chart/barchart/barchart.component';
import { ListvolunteerComponent } from './pages/program/programdetail/detailtable/listvolunteer/listvolunteer.component';
import { TicketdetailComponent } from './pages/program/programdetail/ticketdetail/ticketdetail.component';
import { HomeComponent } from './pages/home/home.component';
import { ListattendanceaddbyemailComponent } from './components/listattendanceaddbyemail/listattendanceaddbyemail.component';
import { TicketapprovalsComponent } from './pages/program/programdetail/ticketapprovals/ticketapprovals.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ForgotpasswordComponent,
		DashboardviewComponent,
		AdminRoutingComponent,
		CampaignlistemailComponent,
		CampaignlistnotifComponent,
		NavigationComponent,
		ListtableComponent,
		UserlistComponent,
		CampaignpreviewComponent,
		CampaignformComponent,
		DragDropDirective,
		RecipientsComponent,
		PreviewComponent,
		NewsfeedlistComponent,
		NewsfeedformComponent,
		PrayerlistComponent,
		PraiselistComponent,
		UserrolesummaryComponent,
		PercenttoggleComponent,
		DashboardviewComponent,
		LoadingSkyporterDirective,
		PopupModalComponent,
		PrayerpraisehistoryComponent,
		InputformComponent,
		MinistrylistComponent,
		MinistryformComponent,
		ProgramformComponent,
		BreakoutComponent,
		PriceComponent,
		ProgramcodeformComponent,
		UserfamilylistComponent,
		UserfamilyformComponent,
		UserfamilydetailComponent,
		UserdetailComponent,
		UserformComponent,
		UserrolelistComponent,
		NgcheckinfamilylistComponent,
		NgcheckinfamilydetailComponent,
		DateComponent,
		ClassregistrantComponent,
		SafePipe,
		SgrolesComponent,
		ProgramcodelistComponent,
		ProgramlistComponent,
		NgcheckinfamilyformComponent,
		SgrolesComponent,
		Safebase64Pipe,
		ProgramdetailComponent,
		DetailtableComponent,
		ListattendancetableComponent,
		ListqrcodecheckinComponent,
		SearchtableComponent,
		ExportfilterComponent,
		DatepickerComponent,
		SmallgroupappointmentlistComponent,
		DashboardinputsundayComponent,
		SundaytableComponent,
		SmallgroupappointmentdetailComponent,
		SmallgrouplistComponent,
		SmallgroupdetailComponent,
		SmallgroupformComponent,
		TransfermemberComponent,
		MinistrydetailComponent,
		InvitevolunteerComponent,
		DlapplicationlistComponent,
		DlapplicationdetailComponent,
		FormComponent,
		SocketComponent,
		SmallgrouptreeComponent,
		WeekpickerComponent,
		ChangeroleComponent,
		UserlistroleComponent,
		UserlistroletableComponent,
		ListroleaddmodalComponent,
		SmallgroupotherexportComponent,
		UserdetailinfoComponent,
		UserdetailprogramComponent,
		UserdetailjourneyComponent,
		UserprogramhistoryComponent,
		ProgramdiagrampopupComponent,
		LinechartComponent,
		DashboardattendanceComponent,
		DashboardusageComponent,
		SmallgrouprequestComponent,
		TablefilelistComponent,
		AddprogramhistoryComponent,
		SmallgroupdashboardComponent,
		SganomalycountComponent,
		ProgramqrdetailComponent,
		SgreqanomalylistComponent,
		DashboardcustomqueryComponent,
		DashboardcustomquerydetailComponent,
		UseractiontableComponent,
		FilelistComponent,
		ListfiletableComponent,
		InputmodalComponent,
		FileInputDirective,
		UnregisteredfilesComponent,
		BillinglistComponent,
		SggrowthchartComponent,
		PiechartComponent,
		SgdemographicComponent,
		SgdiscipleshipjourneyComponent,
		BarchartComponent,
		ListvolunteerComponent,
		TicketdetailComponent,
		HomeComponent,
  ListattendanceaddbyemailComponent,
  TicketapprovalsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		FontAwesomeModule,
		NgbModule,
		ChartsModule,
		NgxSliderModule,
		NgxEmojiPickerModule.forRoot(),
		SimplemdeModule.forRoot({
			// Global options
			options: {
				autosave: { enabled: true, uniqueId: 'indrasaswita' }
			}
		}),
		NgSelectModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
