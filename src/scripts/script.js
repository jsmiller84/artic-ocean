
// Put any global functions etc. here



runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.

	console.log("test run on startup")
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	runtime.getLayout("Main").addEventListener("afterlayoutstart", () => console.log("test 1234"));

});

function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function testFunction() {
}

function Tick(runtime)
{
	// Code to run every tick
}
