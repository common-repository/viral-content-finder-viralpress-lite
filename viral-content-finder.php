<?php defined( 'ABSPATH' ) or die( 'No script kiddies please!' ); ?>

<!-- Login Content -->
<div class="wrap">	
	<h2><?php _e('Viral Content Finder', 'viralpress-lite'); ?></h2>
	<div class="" id="login_status">
	</div>
	<div class="popup">
		<div class="modal fade in" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" data-keyboard="false" data-backdrop="static" aria-hidden="false" style="display: none;">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
						<h4 class="modal-title" id="loginModalLabel"><?php _e('Login', 'viralpress-lite'); ?></h4>
					</div>
					<div class="modal-body">
						<div class="main-login-form">
							<button id="fblogin" type="button" class="btn btn-primary"><span class="dashicons dashicons-facebook-alt"></span> | <?php _e('Connect with Facebook', 'viralpress-lite'); ?></button>
						</div>
					</div>
					<div class="modal-footer">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Search content -->
<div class="col-md-12">
	<div class="row ad">
		<form id="search_form">
			<div class="input-group">
				<input type="text" class="form-control" name="search_term" placeholder="<?php _e('Search for', 'viralpress-lite'); ?>...">
				<span class="input-group-btn">
					<button type="submit" class="btn btn-default"><span class="dashicons dashicons-search"></span></i><?php _e('Search', 'viralpress-lite'); ?></button>
				</span>
				</div>
			</form>			
			<div id="results">
				<table id="results" class="table table-bordered table-striped" width="100%">
					<legend>
						<span><?php _e('Search results', 'viralpress-lite'); ?></span>
					</legend>

					<thead>
						<tr>
							<th><?php _e('Image','viralpress-lite'); ?></th>
							<th><?php _e('Page Name', 'viralpress-lite'); ?></th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<div class="row page-nav">
					<div class="col-md-4 col-md-offset-4">
						<div class="btn-group" role="group" aria-label="...">
							<a data-type="search" id="pages_pagination_previous" href="" type="button" class="search_paging btn btn-default"><span class="dashicons dashicons-arrow-left-alt2"></span></a>
							<a data-type="search" id="pages_pagination_next" href="" type="button" class="search_paging btn btn-default"><span class="dashicons dashicons-arrow-right-alt2"></span></span></a>
						</div>
					</div>
				</div>
			</div>
			<div id="posts">
				<div class="row">
					<div class="col-md-4 col-md-offset-4">
						<button class="btn btn-default" id="back" style="margin: 0 auto; display:block;"><span class="dashicons dashicons-arrow-left-alt"></span> <?php _e('Back', 'viralpress-lite'); ?></button>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-12">
						<legend class="recent_posts">
							<span><?php _e('Recent posts', 'viralpress-lite'); ?></span>
						</legend>
						<!-- Nav tabs -->
						<ul class="nav nav-tabs" id="recent_post_tabs" role="tablist">
							<li role="presentation" class="active"><a href="#video" aria-controls="video" role="tab" data-toggle="tab"><?php _e('Videos', 'viralpress-lite'); ?></a></li>
							<li role="presentation"><a href="#images" aria-controls="images" role="tab" data-toggle="tab"><?php _e('Images', 'viralpress-lite'); ?></a></li>
						</ul>
						<!-- Tab panes -->
						<div class="tab-content">
							<div role="tabpanel" class="tab-pane active" id="video">
								<table id="posts_video" class="table table-bordered table-striped" width="100%">
										<thead>
											<tr>
												<th><?php _e('Video', 'viralpress-lite'); ?></th>
												<th><?php _e('Post', 'viralpress-lite'); ?></th>
												<th>&nbsp;</th>
											</tr>
										</thead>
									<tbody></tbody>
								</table>
								<div id="page-video"></div>
							</div>
							<div role="tabpanel" class="tab-pane" id="images">
								<table id="posts_images" class="table table-bordered table-striped" width="100%">
										<thead>
											<tr>
												<th><?php _e('Image', 'viralpress-lite'); ?></th>
												<th><?php _e('Post', 'viralpress-lite'); ?></th>
												<th>&nbsp;</th>
											</tr>
										</thead>
									<tbody></tbody>
								</table>
								<div id="page-image"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Processing modal -->
<div class="modal fade" tabindex="-1" role="dialog" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h1><?php _e('Processing', 'viralpress-lite'); ?>...</h1>
				<div class="viralpress_loader"> </div>
			</div>
			<div class="modal-footer"> </div>
		</div>
	</div>
</div>