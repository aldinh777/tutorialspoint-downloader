exit unless ARGV[0]
base = File.expand_path(File.dirname(__FILE__)) + '/../www.tutorialspoint.com' + ARGV[0] + '/'
puts "Fixing Problem in " + base
Dir.glob(base + '*').each do |filename|
	puts filename
	begin
		puts 'fixing ' + filename
		content = File.read(filename)
		File.open(filename, 'w+') do |f|
			f.puts content.gsub('https://www.tutorialspoint.com', '')
		end
	rescue Errno::EISDIR
		puts "Failed"
	end
end
