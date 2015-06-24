var extend = require('extend'),
	Prop = extend.Prop,
	smf = require('smf'),
	state = require('state'),
	UI = require('ui'),
	Vector2 = require('vector2'),
	windows = {
		Splash: function(){
			var win = new UI.Window({
				scrollable: true,
				backgroundColor: 'dukeBlue'
			});
			win.add(
				new UI.Image({
					image: 'images/menu_icon.png',
					compositing: 'and',
					position: new Vector2(0,0),
					size: new Vector2(144,168)
				})
			);
			win.on('click','select',function(){
				win.hide();
				(new windows.Main()).show();
			});
			return win;
		},
		Main: function(){
			var menu = new UI.Menu({
				backgroundColor: 'dukeBlue',
				textColor: 'white',
				highlightBackgroundColor: 'white',
				highlightTextColor: 'dukeBlue',
				sections: [
					{
						title: 'Omnimaga',
						items: [
							{
								title: 'Profile',
								subtitle: 'View your profile'
							},
							{
								title: 'Recent',
								subtitle: 'Recent topics'
							},
							{
								title: 'Search',
								subtitle: 'Search for members'
							}
						]
					}
				]
			});
			menu.on('select',function(e){
				var actions = [
					[
						function(){
							smf.info
								.member(state.id)
								.then(function(d){
									(new windows.User(d)).show();
								});
						},
						function(){
							smf.info
								.recent()
								.then(function(d){
									(new windows.Recent(d,0)).show();
								});
						},
						function(){
							smf.search
								.member('dj')
								.then(function(d){
									(new windows.Users(d)).show();
								});
						}
					]
				];
				actions[e.sectionIndex][e.itemIndex]();
			});
			return menu;
		},
		User: function(data){
			return new UI.Card({
				title: data.name,
				subtitle: data.title,
				body: "Posts:\n"+data.posts+"\nGroup:\n"+data.group+"\nRegistered:\n"+(new Date(data.registered*1000)).toDateString(),
				scrollable: true
			});
		},
		Users: function(data){
			var menu = new UI.Menu({
					backgroundColor: 'dukeBlue',
					textColor: 'white',
					highlightBackgroundColor: 'white',
					highlightTextColor: 'dukeBlue',
					sections: [
						{
							title: 'Results',
							items: []
						}
					]
				}),
				i;
			for(i in data){
				menu.item(0,i,{
					title: data[i].name
				});
			}
			menu.on('select',function(e){
				smf.info
					.member(data[e.itemIndex].id)
					.then(function(d){
						(new windows.User(d)).show();
					});
			});
			return menu;
		},
		Topic: function(topic){
			var win = new UI.Window({
					scrollable: true,
					backgroundColor: 'dukeBlue'
				});
			win.add(
				new UI.Text({
					position: new Vector2(0,0),
					size: new Vector2(144,168),
					text: topic.subject,
					color: 'white',
					textOverflow: 'wrap',
					textAlign: 'center'
				})
			);
			return win;
		},
		Recent: function(data,page){
			var menu = new UI.Menu({
					backgroundColor: 'dukeBlue',
					textColor: 'white',
					highlightBackgroundColor: 'white',
					highlightTextColor: 'dukeBlue',
					sections: [
						{
							title: 'Recents',
							items: []
						}
					]
				}),
				i;
			for(i in data){
				menu.item(0,i,{
					title: data[i].subject
				});
			}
			menu.on('select',function(e){
				smf.info
					.topic(data[e.itemIndex].id)
					.then(function(d){
						(new windows.Topic(d)).show();
					});
			});
			return menu;
		}
	};
extend(module.exports,windows);