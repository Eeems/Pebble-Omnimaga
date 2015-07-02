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
				backgroundColor: 'black'
			});
			win.add(
				new UI.Image({
					image: 'images/omni_black.png',
					position: new Vector2(10,10),
					size: new Vector2(28,28)
				})
			);
			win.on('click','select',function(){
				win.hide();
				(new windows.Main()).show();
			});
			return win;
		},
		Error: function(msg,body){
			body = body===undefined?'':body;
			msg = msg===undefined?'':msg;
			var card = new UI.Card({
				scrollable: true,
				title: 'Error',
				subtitle: msg,
				body: body
			});
			card.on('click','select',function(){
				card.hide();
			});
			card.show();
			return card;
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
								})
								.catch(function(e){
									new windows.Error('SMF Error',JSON.stringify(e));
								});
						},
						function(){
							smf.info
								.recent()
								.then(function(d){
									(new windows.Recent(d,0)).show();
								})
								.catch(function(e){
									new windows.Error('SMF Error',JSON.stringify(e));
								});
						},
						function(){
							smf.search
								.member('dj')
								.then(function(d){
									(new windows.Users(d)).show();
								})
								.catch(function(e){
									new windows.Error('SMF Error',JSON.stringify(e));
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
					})
					.catch(function(e){
						new windows.Error('SMF Error',JSON.stringify(e));
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
					})
					.catch(function(e){
						new windows.Error('SMF Error',JSON.stringify(e));
					});
			});
			return menu;
		}
	};
extend(module.exports,windows);